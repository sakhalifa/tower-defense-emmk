import type { Actor } from "./actor";
import type { Vector2D } from "./geometry";
import type { Axis } from "./util";
import type { World } from "./world";

import { isDeepStrictEqual, otherAxis, randomUniqueIntegers } from "./util";
import { createWalker } from "./actor_creators";
import { distance, createVector, movingVector } from "./geometry";
import { getHunger, getSpreadIgnorancePower, getWaypointTarget, getRange, getSpawnProba } from "./props";
import { filterActorsByPosition, filterByKinds } from "./actor";
import { maxAxisValue } from "./world";

/**
 * All the possibles actions for an actor. These actions are called during the phases of the game.
 */
type ActorActions = {
	spawn: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => Actor | undefined;
    temperatureRise: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => number;
    convertEnemies: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => {actorIndices: Array<number>, amount: Array<number>};
    spreadIgnorance: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => {actorIndices: number[], amount: number[]};
    enemyFlee: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => boolean;
    move: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => Vector2D;
    play: (actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis) => Vector2D |undefined;
};

/**
 * All the default actions, so that each Phase can be called on each actor, even if the actor hasn't its specific phase function
 */
const defaultActions: Required<ActorActions> = {
	spawn: (allActors, oneActor, world, spawnerAxis) => undefined,
	temperatureRise: (allActors, oneActor, world, spawnerAxis) => 0,
	spreadIgnorance: (allActors, oneActor, world, spawnerAxis) => { return { actorIndices: [], amount: [] }; },
	convertEnemies: (allActors, oneActor, world, spawnerAxis) => { return { actorIndices: [], amount: [] }; },
	enemyFlee: (allActors, oneActor, world, spawnerAxis) => false,
	move: (allActors, oneActor, world, spawnerAxis) => { return createVector(0, 0); },
	play: (allActors, oneActor, world, spawnerAxis) => undefined
};

/**
 * The "spawner" action.
 * It has a 50% chance to spawn a new actor, which has 70% chance to be an ignorant, or 30% chance to be an ignoranceSpreader.
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns A new actor to be spawned
 */
function spawn(actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis): ReturnType<ActorActions["spawn"]> {
	if (Math.random() < getSpawnProba(actor)) {
		if (Math.random() < 0.7)
			return createWalker("ignorant", actors, actor.position);
		else
			return createWalker("ignoranceSpreader", actors, actor.position);
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
	return actors.find((a) => a.kind === "spaghettiMonster" && isDeepStrictEqual(a.position, actor.position)) === undefined
		? 0 : (getHunger(actor) ?? 1);
}

/**
 * The "spreadIgnorance" action.
 * It returns all the actors the actor will spread faithPoints to, and the amount for which every actor will be impacted.
 * @param actors The actors in the world
 * @param ignoranceSpreader The current actor that spreads faithPoints
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns all the actors the actor will spread faithPoints to, and the amount for which every actor will be impacted.
 */
function spreadIgnorance(actors: Array<Actor>, ignoranceSpreader: Actor, world: World, spawnerAxis?: Axis): ReturnType<ActorActions["spreadIgnorance"]> {
	const actorsToSpreadIgnoranceIndices: Array<number> = actors.reduce((actorsToSpreadIgnorance: Array<number>, currentActor: Actor, actorIndex: number) => 
	currentActor.kind === "ignorant" && distance(currentActor.position, ignoranceSpreader.position) <= getRange(ignoranceSpreader) ? actorsToSpreadIgnorance.concat(actorIndex) : actorsToSpreadIgnorance,
	[]);
	const amount = actorsToSpreadIgnoranceIndices.map((_) => getSpreadIgnorancePower(ignoranceSpreader));
	return { actorIndices: actorsToSpreadIgnoranceIndices, amount }; // amount is an array of the same number, but this could be changed
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
 * The "convertEnemies" action.
 * It returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 */
function convertEnemies(actors: Array<Actor>, actor: Actor, world: World, spawnerAxis?: Axis): ReturnType<ActorActions["convertEnemies"]> {
	const range = getRange(actor) ?? 3;
	const actorIndices = actors.filter((currentActor) => currentActor !== actor && currentActor.kind !== "ignorant" && distance(currentActor.position, actor.position) <= range).map((a, i) => i);
	const amount = actorIndices.map((_) => getHunger(actor) ?? 1);
	return { actorIndices, amount };
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
	if (actor.kind === "ground" || actor.kind === "goodGuy")
		return false;
	return (actor?.faithPoints ?? 0) <= 0;
}

function playAroundGround(actors: Array<Actor>, ground: Actor): Vector2D | undefined {
	return undefined; // wip
}

function play(actors: Array<Actor>, actor: Actor, world: World, spawnerAxis: Axis): ReturnType<ActorActions["play"]> {
	const numberOfLines = maxAxisValue(world, otherAxis(spawnerAxis));
	const consideredLineOrder: Array<number> = randomUniqueIntegers(numberOfLines - 1, numberOfLines - 1, 0, numberOfLines - 1);
	const groundsPerLine: Array<Array<Actor>> = consideredLineOrder.map(
		(consideredLine) => filterByKinds(
			spawnerAxis === "x" ? filterActorsByPosition(actors, undefined, consideredLine) : filterActorsByPosition(actors, consideredLine, undefined),
			["ground"]
		));
	Array.from({length: maxAxisValue(world, spawnerAxis) - 1}, (_, i) => i + 1).reduce((acc, groundsPerLineConstraint) => groundsPerLine.forEach((currentGrounds) => {
		if (currentGrounds.length === groundsPerLineConstraint) {
			const groundAroundWhichToPlay: Actor | undefined = currentGrounds.find((currentGround) => playAroundGround(actors, currentGround));
		}
		return undefined;
	}
	), undefined);
	return undefined;
}

export type {ActorActions};

export { temperatureRise, spreadIgnorance, convertEnemies, enemyFlee, spawn, moveTowardWaypointTarget, defaultActions, play };