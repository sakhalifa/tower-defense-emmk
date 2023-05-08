import type { Actor, Kind } from "./actor";
import type { Vector2D } from "./geometry";
import type { Axis } from "./util";
import { World, getVectorsInRangeInWorld, allPositionsInWorld } from "./world";

import { isDeepStrictEqual, otherAxis, randomUniqueIntegers, getRandomArrayElement, fisherYatesShuffle } from "./util";
import { createWalker } from "./actor_creators";
import { distance, createVector, movingVector } from "./geometry";
import { getConviction, getWaypointTarget, getRange, getSpawnProba, getSpreadIgnorancePower, getFaithPoints, getPlayProba } from "./props";
import { filterActorsByPosition, filterByKinds, hasOneOfKinds, walkerKeys } from "./actor";
import { AxisLength } from "./world";

type ActorActionParams = {actorsAcc: Array<Actor>, actingActor: Actor, world: World, spawnersAxis: Axis};

/**
 * All the possibles actions for an actor. These actions are called during the phases of the game.
 */
type ActorActions = {
	spawn: (params: ActorActionParams) => Actor | undefined;
	temperatureRise: (params: ActorActionParams) => number;
	convertEnemies: (params: ActorActionParams) => ReturnType<typeof impactActorsConviction>;
	spreadIgnorance: (params: ActorActionParams) => ReturnType<typeof impactActorsConviction>;
	enemyFlee: (params: ActorActionParams) => boolean;
	move: (params: ActorActionParams) => Vector2D;
	play: (params: ActorActionParams) => Vector2D | undefined;
};

/**
 * All the default actions, so that each Phase can be called on each actor, even if the actor hasn't its specific phase function
 */
const defaultActions: Required<ActorActions> = {
	spawn: (params) => undefined,
	temperatureRise: (params) => 0,
	spreadIgnorance: (params) => { return { impactedActorsIndices: [], impactAmounts: [] }; },
	convertEnemies: (params) => { return { impactedActorsIndices: [], impactAmounts: [] }; },
	enemyFlee: (params) => false,
	move: (params) => { return createVector(0, 0); },
	play: (params) => undefined
};

/**
 * The "spawner" action.
 * It has a 50% chance to spawn a new actor, which has 70% chance to be an ignorant, or 30% chance to be an ignoranceSpreader.
 * @param params.actorsAcc The actors in the world
 * @param params.actingActor The current spawner that does the action
 * @returns A new actor to be spawned
 */
function spawn(params: ActorActionParams): ReturnType<ActorActions["spawn"]> {
	if (Math.random() < getSpawnProba(params.actingActor)) {
		if (Math.random() < 0.7)
			return createWalker("ignorant", params.actorsAcc, params.actingActor.position);
		else
			return createWalker("ignoranceSpreader", params.actorsAcc, params.actingActor.position);
	}
	return undefined;
}

/**
 * The "temperatureRise" action.
 * It returns the damage done to the spaghetti monster. The actor only does damage if it's on the same
 * position as the spaghetti monster
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns The amount of damage to do to the spaghetti monster
 */
function temperatureRise(params: ActorActionParams): ReturnType<ActorActions["temperatureRise"]> {
	return params.actorsAcc.find((a) => hasOneOfKinds(a, ["spaghettiMonster"]) && isDeepStrictEqual(a.position, params.actingActor.position))
	=== undefined ? 0 : getConviction(params.actingActor);
}

function impactActorsConviction(actors: Array<Actor>, actingActor: Actor, impactedKinds: Array<Kind>,
								impactFunction: (impactingActor: Actor, actorsToImpact: Array<Actor>) => Array<number>,
								): { impactedActorsIndices: Array<number>, impactAmounts: Array<number>; }
{
	const impactedActorsIndices: Array<number> = actors.reduce((acc: Array<number>, currentActor: Actor, actorIndex: number) =>
		hasOneOfKinds(currentActor, impactedKinds) && distance(currentActor.position, actingActor.position) <= getRange(actingActor) ?
		acc.concat(actorIndex) :
		acc,
		[]);
	const impactAmounts = impactFunction(actingActor, impactedActorsIndices.map((i) => actors[i]));
	return { impactedActorsIndices, impactAmounts };
}

/**
 * The "spreadIgnorance" action.
 * It returns all the actors the actor will spread faithPoints to, and the amount for which every actor will be impacted.
 * @param actors The actors in the world
 * @param actingActor The current actor that spreads faithPoints
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns all the actors the actor will spread faithPoints to, and the amount for which every actor will be impacted.
 */
function spreadIgnorance(params: ActorActionParams): ReturnType<ActorActions["spreadIgnorance"]> {
	return impactActorsConviction(params.actorsAcc, params.actingActor, ["ignorant"],
	(impactingActor, actorsToImpact) => Array.from({length: actorsToImpact.length}, (_) => getSpreadIgnorancePower(impactingActor)));
}

/**
 * The "convertEnemies" action.
 * It returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 * @param actors The actors in the world
 * @param actingActor The current actor that does the action
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 */
function convertEnemies(params: ActorActionParams): ReturnType<ActorActions["convertEnemies"]> {
	return impactActorsConviction(params.actorsAcc, params.actingActor, [...walkerKeys],
	(impactingActor, actorsToImpact) => Array.from({length: actorsToImpact.length}, (_) => -1 * getConviction(impactingActor)));
}

/**
 * A "move" action
 * Returns the movement vector corresponding to the movement that the given actor should do to get closer to its waypointTarget
 * @param actors all the actors of the world
 * @param params.actingActor the actor that is moving
 * @param params.spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns the movement vector corresponding to the movement that the given actor should do to get closer to its waypointTarget
 */
function moveTowardWaypointTarget(params: ActorActionParams): ReturnType<ActorActions["move"]> {
	return movingVector(params.actingActor.position, getWaypointTarget(params.actingActor), otherAxis(params.spawnersAxis));
}

/**
 * The "enemyFlee" action.
 * It returns whether the actor will decide to not exist or not.
 * @param actors The actors in the world
 * @param params.actingActor The current actor that does the action
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns true iif the current actor decides to not exist anymore
 */
function enemyFlee(params: ActorActionParams): ReturnType<ActorActions["enemyFlee"]> {
	return hasOneOfKinds(params.actingActor, [...walkerKeys, "spaghettiMonster"]) ? getFaithPoints(params.actingActor) <= 0 : false;
}

function getEmptyCell(world: World, actors: Array<Actor>): Vector2D | undefined {
	return fisherYatesShuffle(allPositionsInWorld(world)).find((currentWorldPosition) => 
	!actors.some((currentActor) => isDeepStrictEqual(currentActor.position, currentWorldPosition)));
}

function getEmptyCellsInRange(world: World, actors: Array<Actor>, fromPosition: Vector2D, range: number, distanceFunction: (a: Vector2D, b: Vector2D) => number): Array<Vector2D> {
	return getVectorsInRangeInWorld(range, distanceFunction, world, fromPosition).filter((currentWorldPosition) => 
	distance(currentWorldPosition, fromPosition) <= range &&
	!actors.some((currentActor) => isDeepStrictEqual(currentActor.position, currentWorldPosition)));
}

function getEmptyCellInRange(world: World, actors: Array<Actor>, position: Vector2D, range: number, distanceFunction: (a: Vector2D, b: Vector2D) => number): Vector2D | undefined {
	const possibleMoves = getEmptyCellsInRange(world, actors, position, range, distanceFunction);
	return possibleMoves.length > 0 ? getRandomArrayElement(possibleMoves) : undefined;
}

function playPriorityAroundLoneGrounds(actors: Array<Actor>, world: World, spawnerAxis: Axis): Vector2D | undefined {
	const numberOfLines = AxisLength(world, otherAxis(spawnerAxis));
	const consideredLineOrder: Array<number> = randomUniqueIntegers(numberOfLines, numberOfLines, 0, numberOfLines);
	const groundListPerLine: Array<Array<Actor>> = consideredLineOrder.map(
		(consideredLine) => filterByKinds(
			spawnerAxis === "x" ? filterActorsByPosition(actors, undefined, consideredLine) : filterActorsByPosition(actors, consideredLine, undefined),
			["ground"]
		));
	const range: number = 2;
	const returnedGroundAroundWhichToPlay: Actor | undefined = Array.from({ length: AxisLength(world, spawnerAxis) - 1 }, (_, i) => i + 1)
	.reduce((acc, groundListPerLineConstraint) => {
		if (acc) return acc;
		return groundListPerLine.reduce((acc2, currentGrounds) => {
			if (acc2) return acc2;
			if (currentGrounds.length === groundListPerLineConstraint) {
				const groundAroundWhichToPlay: Actor | undefined = currentGrounds
				.find((currentGround) => getEmptyCellInRange(world, actors, currentGround.position, range, distance));
				return groundAroundWhichToPlay;
			}
			return acc2;
		}
		, undefined);
	}, undefined);
	return returnedGroundAroundWhichToPlay ? getEmptyCellInRange(world, actors, returnedGroundAroundWhichToPlay.position, range, distance) : undefined;
}

/**
 * A "play" action
 * @param params.actingActor the player
 * @returns 
 */
function play(params: ActorActionParams): ReturnType<ActorActions["play"]> {
	if (Math.random() > getPlayProba(params.actingActor)) return undefined;
	return playPriorityAroundLoneGrounds(params.actorsAcc, params.world, params.spawnersAxis) ?? getEmptyCell(params.world, params.actorsAcc);
}

export type { ActorActions, ActorActionParams };

export { temperatureRise, spreadIgnorance, convertEnemies, enemyFlee, spawn, moveTowardWaypointTarget, defaultActions, play, impactActorsConviction };