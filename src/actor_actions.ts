import type { Actor } from "./actor";

import { isDeepStrictEqual } from "./util";
import { createWalker } from "./actor";
import { distance, createVector, Vector2D } from "./geometry";
import { getHunger, getSpreadIgnorancePower, getWaypointTarget, getRange } from "./props";

/**
 * All the possibles actions for an actor. These actions are called during the phases of the game.
 */
type ActorActions = {
	spawn: (actors: Array<Actor>, actor: Actor) => Actor | undefined;
    temperatureRise: (actors: Array<Actor>, actor: Actor) => number;
    convertEnemies: (actors: Array<Actor>, actor: Actor) => {actorIndices: Array<number>, amount: Array<number>};
    spreadIgnorance: (actors: Array<Actor>, actor: Actor) => {actorIndices: number[], amount: number[]};
    enemyFlee: (actors: Array<Actor>, actor: Actor) => boolean;
    move: (actors: Array<Actor>, actor: Actor) => Vector2D;
};

/**
 * All the default actions, so that each Phase can be called on each actor, even if the actor hasn't its specific phase function
 */
const defaultActions: Required<ActorActions> = {
	spawn: (allActors, oneActor) => undefined,
	temperatureRise: (allActors, oneActor) => 0,
	spreadIgnorance: (allActors, oneActor) => { return { actorIndices: [], amount: [] }; },
	convertEnemies: (allActors, oneActor) => { return { actorIndices: [], amount: [] }; },
	enemyFlee: (allActors, oneActor) => false,
	move: (allActors, oneActor) => { return createVector(0, 0); }
};

/**
 * The "spawner" action.
 * It has a 50% chance to spawn a new actor, which has 70% chance to be an ignorant, or 30% chance to be an ignoranceSpreader.
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns A new actor to be spawned
 */
function spawn(actors: Array<Actor>, actor: Actor): ReturnType<ActorActions["spawn"]> {
	if (Math.random() < 0.5)
		return undefined;
	else {
		if (Math.random() < 0.7)
			return createWalker("ignorant", actors);
		else
			return createWalker("ignoranceSpreader", actors);
	}
}

/**
 * The "temperatureRise" action.
 * It returns the damage done to the spaghetti monster. The actor only does damage if it's on the same
 * position as the spaghetti monster
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns The amount of damage to do to the spaghetti monster
 */
function temperatureRise(actors: Array<Actor>, actor: Actor): ReturnType<ActorActions["temperatureRise"]> {
	return actors.find((a) => a.kind === "spaghettiMonster" && isDeepStrictEqual(a.position, actor.position)) === undefined
		? 0 : (getHunger(actor) ?? 1);
}

/**
 * The "spreadIgnorance" action.
 * It returns all the actors the actor will spread ignorance to, and the amount for which every actor will be impacted.
 * @param actors The actors in the world
 * @param ignoranceSpreader The current actor that spreads ignorance
 * @returns all the actors the actor will spread ignorance to, and the amount for which every actor will be impacted.
 */
function spreadIgnorance(actors: Array<Actor>, ignoranceSpreader: Actor): ReturnType<ActorActions["spreadIgnorance"]> {
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
 * @returns the movement vector corresponding to the movement that the given actor should do to get closer to its waypointTarget
 */
function moveTowardWaypointTarget(actors: Array<Actor>, movingActor: Actor): ReturnType<ActorActions["move"]> {
	return movingVector(movingActor.position, getWaypointTarget(movingActor));
}

/**
 * Returns a Vector2D containing the information of the movement that has to be done in order to move towards the given toPosition.
 * First, the movement is done along the abscissa axis, then along the ordinate axis.
 * @param fromPosition the initial position, before the movement
 * @param toPosition the position that we want to reach, from the fromPosition
 * @returns a Vector2D containing the information of the movement that has to be done in order to move towards the given toPosition.
 */
function movingVector(fromPosition: Vector2D, toPosition: Vector2D): Vector2D {
	if (fromPosition.x < toPosition.x) {
		return createVector(1, 0);
	} else if (fromPosition.x > toPosition.x) {
		return createVector(-1, 0);
	} else if (fromPosition.y < toPosition.y) {
		return createVector(0, 1);
	} else if (fromPosition.y > toPosition.y) {
		return createVector(0, -1);
	} else {
		return createVector(0, 0);
	}
}

/**
 * The "convertEnemies" action.
 * It returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 */
function convertEnemies(actors: Array<Actor>, actor: Actor): ReturnType<ActorActions["convertEnemies"]> {
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
 * @returns true iif the current actor decides to not exist anymore
 */
function enemyFlee(actors: Array<Actor>, actor: Actor): ReturnType<ActorActions["enemyFlee"]> {
	if (actor.kind === "ground" || actor.kind === "goodGuy")
		return false;
	return (actor?.ignorance ?? 0) <= 0;
}

export { temperatureRise, spreadIgnorance, convertEnemies, enemyFlee, spawn, moveTowardWaypointTarget, movingVector, defaultActions };
export type {ActorActions};