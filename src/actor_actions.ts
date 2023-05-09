import type { Actor, Kind } from "./actor";
import type { Vector2D } from "./geometry";
import type { Axis } from "./util";
import { World, getVectorsInRangeInWorld, allPositionsInWorld, getPositionsNotInGivenPositions } from "./world";

import { isDeepStrictEqual, otherAxis, randomUniqueIntegers, getRandomArrayElement,
	fisherYatesShuffle, arrayWithoutElementAtIndex, getRandomArrayElementNotInOtherArray } from "./util";
import { createWalker } from "./actor_creators";
import { distance, createVector, movingVector } from "./geometry";
import { getConviction, getWaypointTarget, getRange, getSpawnProba, getSpreadIgnorancePower, getFaithPoints, getPlayProba } from "./props";
import { filterActorsByPosition, filterByKinds, hasOneOfKinds, walkerKeys, kindKeys } from "./actor";
import { AxisLength } from "./world";

/**
 * uniform parameters that the actions must have.
 * 
 * actorsAcc: All the actors that the action can take into consideration
 * actingActor: The actor doing the action
 * world: The world on which the action takes place
 * spawnerAxis: The axis along which the spawners were created on the world
 */
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
 * Contains the signatures that the action generators of the Actors must respect
 */
type ActionGenerators = {
	[Key in keyof ActorActions]: [() => ActionGenerators[Key], ActorActions[Key]];
};

/**
 * Creates a default action generator for the given action.
 * @param action the action we want to decorate to create a generator returning functions to use after the use of the given function
 * @returns an action generator that will always return the same generator and the same action as the given action
 */
function createDefaultActionGenerator<Key extends keyof ActorActions>(action: ActorActions[Key]): ActionGenerators[Key] {
	return [() => createDefaultActionGenerator(action), action] as ActionGenerators[Key];
}

/**
 * All the default actions, so that each Phase can be called on each actor, even if the actor hasn't its specific phase function
 */
const defaultActions: ActorActions = {
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
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
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
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
 * @returns The amount of damage to do to the spaghetti monster
 */
function temperatureRise(params: ActorActionParams): ReturnType<ActorActions["temperatureRise"]> {
	return params.actorsAcc.find((a) => hasOneOfKinds(a, ["spaghettiMonster"]) && isDeepStrictEqual(a.position, params.actingActor.position))
	=== undefined ? 0 : getConviction(params.actingActor);
}

/**
 * Filter the actors whose faith must be impacted (positively or negatively) and return an object containing their indices and how much their faith is impacted
 * @param actors the actors from which the impacted actors are filtered
 * @param actingActor the actor that is impacting the faith of the other actors
 * @param impactedKinds the kinds of the actors that can be impacted by the actingActor
 * @param impactFunction the function defining the value by which the faith of the actors is impacted
 * @returns an object containing:
 * - the indices, in the given actors, of the impacted actors
 * - the values corresponding to how much the faithPoints of the impacted actors are impacted
 */
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
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
 * @returns all the actors the actor will spread faithPoints to, and the amount for which every actor will be impacted.
 */
function spreadIgnorance(params: ActorActionParams): ReturnType<ActorActions["spreadIgnorance"]> {
	return impactActorsConviction(params.actorsAcc, params.actingActor, ["ignorant"],
	(impactingActor, actorsToImpact) => Array.from({length: actorsToImpact.length}, (_) => getSpreadIgnorancePower(impactingActor)));
}

/**
 * The "convertEnemies" action.
 * It returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
 * @returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 */
function convertEnemies(params: ActorActionParams): ReturnType<ActorActions["convertEnemies"]> {
	return impactActorsConviction(params.actorsAcc, params.actingActor, [...walkerKeys],
	(impactingActor, actorsToImpact) => Array.from({length: actorsToImpact.length}, (_) => -1 * getConviction(impactingActor)));
}

/**
 * A "move" action
 * Returns the movement vector corresponding to the movement that the given actor should do to get closer to its waypointTarget
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
 * @returns the movement vector corresponding to the movement that the given actor should do to get closer to its waypointTarget
 */
function moveTowardWaypointTarget(params: ActorActionParams): ReturnType<ActorActions["move"]> {
	return movingVector(params.actingActor.position, getWaypointTarget(params.actingActor), otherAxis(params.spawnersAxis));
}

/**
 * The "enemyFlee" action.
 * It returns whether the actor will decide to not exist or not.
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
 * @returns true iif the current actor decides to not exist anymore
 */
function enemyFlee(params: ActorActionParams): ReturnType<ActorActions["enemyFlee"]> {
	return hasOneOfKinds(params.actingActor, [...walkerKeys, "spaghettiMonster"]) ? getFaithPoints(params.actingActor) <= 0 : false;
}

function getEmptyCellsInRange(world: World, actors: Array<Actor>, fromPosition: Vector2D, range: number,
	distanceFunction: (a: Vector2D, b: Vector2D) => number): Array<Vector2D> 
{
	return getVectorsInRangeInWorld(range, distanceFunction, world, fromPosition).filter((currentWorldPosition) => 
	distance(currentWorldPosition, fromPosition) <= range &&
	!actors.some((currentActor) => isDeepStrictEqual(currentActor.position, currentWorldPosition)));
}

function getEmptyCellInRange(world: World, actors: Array<Actor>, position: Vector2D, range: number,
	distanceFunction: (a: Vector2D, b: Vector2D) => number): Vector2D | undefined 
{
	const possibleMoves = getEmptyCellsInRange(world, actors, position, range, distanceFunction);
	return possibleMoves.length > 0 ? getRandomArrayElement(possibleMoves) : undefined;
}

/**
 * A "play" action
 * Returns a good positions, or undefined if no good position avaible
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
 * @returns a good positions, or undefined if no good position avaible
 */
function playPriorityAroundLoneGrounds(params: ActorActionParams): Vector2D | undefined {
	const numberOfLines = AxisLength(params.world, otherAxis(params.spawnersAxis));
	const consideredLineOrder: Array<number> = randomUniqueIntegers(numberOfLines, numberOfLines, 0, numberOfLines);
	const groundListPerLine: Array<Array<Actor>> = consideredLineOrder.map(
		(consideredLine) => filterByKinds(
			params.spawnersAxis === "x" ? filterActorsByPosition(params.actorsAcc, undefined, consideredLine) : filterActorsByPosition(params.actorsAcc, consideredLine, undefined),
			["ground"]
		));
	const range: number = 2;
	const returnedGroundAroundWhichToPlay: Actor | undefined = Array.from({ length: AxisLength(params.world, params.spawnersAxis) - 1 }, (_, i) => i + 1)
	.reduce((acc, groundListPerLineConstraint) => {
		if (acc) return acc;
		return groundListPerLine.reduce((acc2, currentGrounds) => {
			if (acc2) return acc2;
			if (currentGrounds.length === groundListPerLineConstraint) {
				const groundAroundWhichToPlay: Actor | undefined = currentGrounds
				.find((currentGround) => getEmptyCellInRange(params.world, params.actorsAcc, currentGround.position, range, distance));
				return groundAroundWhichToPlay;
			}
			return acc2;
		}
		, undefined);
	}, undefined);
	return returnedGroundAroundWhichToPlay ? getEmptyCellInRange(params.world, params.actorsAcc, returnedGroundAroundWhichToPlay.position, range, distance) : undefined;
}

/**
 * A "play" action
 * Returns a random valid position for the play action
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
 * @returns a random valid position for the play action, or undefined if no positions avaible
 */
function playRandomValid(params: ActorActionParams): ReturnType<ActorActions["play"]> {
	return getPositionsNotInGivenPositions(
		params.world, 
		filterByKinds(params.actorsAcc, arrayWithoutElementAtIndex([...kindKeys], [...kindKeys].indexOf("player"))).map((a) => a.position)
	);
}

/**
 * A "play" action
 * Returns a good positions, or if no good position found, returns a random valid action for the play action, or undefined if no position avaible
 * @param params The uniform parameters for the actions. See {@link ActorActionParams} for further details.
 * @returns a good positions, or if no good position found, returns a random valid action for the play action, or undefined if no position avaible
 */
function play(params: ActorActionParams): ReturnType<ActorActions["play"]> {
	if (Math.random() > getPlayProba(params.actingActor)) return undefined;
	return playPriorityAroundLoneGrounds(params) ??
	playRandomValid(params);
}

export type { ActorActions, ActionGenerators, ActorActionParams };

export { temperatureRise, spreadIgnorance, convertEnemies, enemyFlee, spawn, moveTowardWaypointTarget,
	defaultActions, play, impactActorsConviction, createDefaultActionGenerator};