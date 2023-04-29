import type { Actor, Walker } from "./actor";

import { isDeepStrictEqual } from "./util";
import { createHealer, createIgnorant } from "./actor";
import { distance, createVector, Vector2D } from "./geometry";
import { getHunger, getHealPower, getWaypointTarget, getRange } from "./props";

/**
 * All the possibles actions for an actor.
 */
type ActorActions = {
	spawn: (actors: Array<Actor>, actor: Actor) => Actor | undefined;
    temperatureRise: (actors: Array<Actor>, actor: Actor) => number;
    convertEnemies: (actors: Array<Actor>, actor: Actor) => {actorIndices: Array<number>, amount: Array<number>};
    heal: (actors: Array<Actor>, actor: Actor) => {actorIndices: number[], amount: number[]};
    enemyFlee: (actors: Array<Actor>, actor: Actor) => boolean;
    move: (actors: Array<Actor>, actor: Actor) => Vector2D;
};

/**
 * All the default actions 
 */
const defaultActions: Required<ActorActions> = {
	spawn: (allActors, oneActor) => undefined,
	temperatureRise: (allActors, oneActor) => 0,
	heal: (allActors, oneActor) => { return { actorIndices: [], amount: [] }; },
	convertEnemies: (allActors, oneActor) => { return { actorIndices: [], amount: [] }; },
	enemyFlee: (allActors, oneActor) => false,
	move: (allActors, oneActor) => { return createVector(0, 0); }
};

/**
 * The "spawner" action.
 * It has a 50% chance to spawn a new actor, which has 70% chance to be an ignorant, or 30% chance to be a healer.
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns A new actor to be spawned
 */
function spawn(actors: Array<Actor>, actor: Actor): ReturnType<ActorActions["spawn"]> {
	//if (Math.random() < 0.5)
	//	return undefined;
	//else {
	//	if (Math.random() < 0.7)
	//		return createIgnorant();
	//	else
	//		return createHealer();
	//}
	return undefined;
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
	return actors.find((a) => a.kind === "spaghettimonster" && isDeepStrictEqual(a.position, actor.position)) === undefined
		? 0 : (getHunger(actor) ?? 1);
}

/**
 * The "heal" action.
 * It returns all the actors the actor will heal, and the amount for which every actor healed will be healed.
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns all the actors that will be healed, and the amount for which every actor healed will be healed
 */
function heal(actors: Array<Actor>, actor: Actor): ReturnType<ActorActions["heal"]> {
	const range = getRange(actor) ?? 3;
	const actorIndices: Array<number> = actors.reduce((actorsToHeal: Array<number>, currentActor: Actor, actorIndex: number) => 
	currentActor.kind === "ignorant" && distance(currentActor.position, actor.position) <= range ? actorsToHeal.concat(actorIndex) : actorsToHeal,
	[]);
	const amount = actorIndices.map((_) => getHealPower(actor) ?? 1);
	return { actorIndices, amount }; // amount is an array of the same number...
}

function moveTowardWaypointTarget(actors: Array<Actor>, movingActor: Actor): ReturnType<ActorActions["move"]> {
	//console.log(movingActor.kind);
	//if (movingActor.kind !== "healer" && movingActor.kind !== "ignorant") { // in Walker !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//	return createVector(0, 0);
	//} else {
		return movingVector(movingActor.position, getWaypointTarget(movingActor));
	//}
}

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

export { temperatureRise, heal, convertEnemies, enemyFlee, spawn, moveTowardWaypointTarget, movingVector, defaultActions };
export type {ActorActions};