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

/**
 * All the possibles actions for an actor. These actions are called during the phases of the game.
 */
type ActorActions = {
	spawn: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => Actor | undefined;
	temperatureRise: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => number;
	convertEnemies: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => ReturnType<typeof impactActorsConviction>;
	spreadIgnorance: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => ReturnType<typeof impactActorsConviction>;
	enemyFlee: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => boolean;
	move: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => Vector2D;
	play: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => Vector2D | undefined;
};

/**
 * All the default actions, so that each Phase can be called on each actor, even if the actor hasn't its specific phase function
 */
const defaultActions: Required<ActorActions> = {
	spawn: (allActors, oneActor, world, spawnerAxis) => undefined,
	temperatureRise: (allActors, oneActor, world, spawnerAxis) => 0,
	spreadIgnorance: (allActors, oneActor, world, spawnerAxis) => { return { impactedActorsIndices: [], impactAmounts: [] }; },
	convertEnemies: (allActors, oneActor, world, spawnerAxis) => { return { impactedActorsIndices: [], impactAmounts: [] }; },
	enemyFlee: (allActors, oneActor, world, spawnerAxis) => false,
	move: (allActors, oneActor, world, spawnerAxis) => { return createVector(0, 0); },
	play: (allActors, oneActor, world, spawnerAxis) => undefined
};

/**
 * The "spawner" action.
 * It has a 50% chance to spawn a new actor, which has 70% chance to be an ignorant, or 30% chance to be an ignoranceSpreader.
 * @param actors The actors in the world
 * @param spawner The current actor that does the action
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns A new actor to be spawned
 */
function spawn(actors: Array<Actor>, spawner: Actor, world: World, spawnerAxis?: Axis): ReturnType<ActorActions["spawn"]> {
	if (Math.random() < getSpawnProba(spawner)) {
		if (Math.random() < 0.7)
			return createWalker("ignorant", actors, spawner.position);
		else
			return createWalker("ignoranceSpreader", actors, spawner.position);
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
function temperatureRise(actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis): ReturnType<ActorActions["temperatureRise"]> {
	return actors.find((a) => hasOneOfKinds(a, ["spaghettiMonster"]) && isDeepStrictEqual(a.position, actor.position))
	=== undefined ? 0 : getConviction(actor);
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
function spreadIgnorance(actors: Array<Actor>, actingActor: Actor, world: World, spawnerAxis?: Axis): ReturnType<ActorActions["spreadIgnorance"]> {
	return impactActorsConviction(actors, actingActor, ["ignorant"],
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
function convertEnemies(actors: Array<Actor>, actingActor: Actor, world: World, spawnerAxis?: Axis): ReturnType<ActorActions["convertEnemies"]> {
	return impactActorsConviction(actors, actingActor, [...walkerKeys],
	(impactingActor, actorsToImpact) => Array.from({length: actorsToImpact.length}, (_) => -1 * getConviction(impactingActor)));
}

/**
 * Returns the movement vector corresponding to the movement that the given actor should do to get closer to its waypointTarget
 * @param actors all the actors of the world
 * @param movingActor the actor that is moving
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns the movement vector corresponding to the movement that the given actor should do to get closer to its waypointTarget
 */
function moveTowardWaypointTarget(actors: Array<Actor>, movingActor: Actor, world: World, spawnersAxis: Axis): ReturnType<ActorActions["move"]> {
	return movingVector(movingActor.position, getWaypointTarget(movingActor), otherAxis(spawnersAxis));
}

/**
 * The "enemyFlee" action.
 * It returns whether the actor will decide to not exist or not.
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns true iif the current actor decides to not exist anymore
 */
function enemyFlee(actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis): ReturnType<ActorActions["enemyFlee"]> {
	return hasOneOfKinds(actor, [...walkerKeys, "spaghettiMonster"]) ? getFaithPoints(actor) <= 0 : false;
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

function play(actors: Array<Actor>, actor: Actor, world: World, spawnerAxis: Axis): ReturnType<ActorActions["play"]> {
	if (Math.random() > getPlayProba(actor)) return undefined;
	return playPriorityAroundLoneGrounds(actors, world, spawnerAxis) ?? getEmptyCell(world, actors);
}

export type { ActorActions };

export { temperatureRise, spreadIgnorance, convertEnemies, enemyFlee, spawn, moveTowardWaypointTarget, defaultActions, play, impactActorsConviction };