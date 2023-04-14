import { isDeepStrictEqual } from "util";
import { Actor, createHealer, createIgnorant, defaultActions } from "./actor";
import type { ActionReturnTypes, Phase } from "./phase";
import { distance, createVector, Vector2D } from "./geometry";

/**
 * The "spawner" action.
 * It has a 50% chance to spawn a new actor, which has 50% chance to be an ignorant, or 50% chance to be a healer.
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns A new actor to be spawned
 */
function spawn(actors: Array<Actor>, actor: Actor): ActionReturnTypes["spawn"] {
	if (Math.random() < 0.5)
		return undefined;
	else {
		if (Math.random() < 0.5)
			return createIgnorant();
		else
			return createHealer();
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
function temperatureRise(actors: Array<Actor>, actor: Actor): ActionReturnTypes["temperatureRise"] {
	return actors.find((a) => a.kind === "spaghettimonster" && isDeepStrictEqual(a.position, actor.position)) === undefined
		? 0 : (actor.externalProps?.attackPower ?? 1);
}

/**
 * The "heal" action.
 * It returns all the actors the actor will heal, and the amount for which every actor healed will be healed.
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns all the actors that will be healed, and the amount for which every actor healed will be healed
 */
function heal(actors: Array<Actor>, actor: Actor): ActionReturnTypes["heal"] {
	const range = actor.externalProps?.range ?? 3;
	const actorIndices: Array<number> = actors.reduce((actorsToHeal: Array<number>, currentActor: Actor, actorIndex: number) =>
		currentActor.kind === "ignorant" && distance(currentActor.position, actor.position) <= range ? actorsToHeal.concat(actorIndex) : actorsToHeal,
		[]);
	const amount = actorIndices.map((_) => actor.externalProps?.healPower ?? 1);
	return { actorIndices, amount }; // amount is an array of the same number...
}

function moveRight(actors: Array<Actor>, a: Actor): ActionReturnTypes["move"] {
	return createVector(1, 0);
}

/**
 * The "convertEnemies" action.
 * It returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns all the actors that will be damaged, and the amount for which every actor damaged will be damaged
 */
function convertEnemies(actors: Array<Actor>, actor: Actor): ActionReturnTypes["convertEnemies"] {
	const range = actor.externalProps?.range ?? 3;
	const actorIndices = actors.filter((currentActor) => currentActor.kind === "ignorant" && distance(currentActor.position, actor.position) <= range).map((a, i) => i);
	const amount = actorIndices.map((_) => actor.externalProps?.attackPower ?? 1);
	return { actorIndices, amount };
}

/**
 * The "enemyFlee" action.
 * It returns whether the actor will decide to not exist or not.
 * @param actors The actors in the world
 * @param actor The current actor that does the action
 * @returns true iif the current actor decides to not exist anymore
 */
function enemyFlee(actors: Array<Actor>, actor: Actor): ActionReturnTypes["enemyFlee"] {
	if (actor.kind === "ground" || actor.kind === "goodGuy")
		return false;
	return (actor?.faithPoints ?? 0) <= 0;
}

function paralyzeMove(actors: Array<Actor>, actor: Actor): Vector2D {
	return actor.externalProps?.childActor.actions["move"](actors, actor);
}

function catapultParalyze(actors: Array<Actor>, actor: Actor): ActionReturnTypes["paralyze"] {
	const range = actor.externalProps?.range ?? 3;
	const closestPos = actors
		.filter((a) => a.kind === "ignorant" && distance(a.position, actor.position) <= range)
		.reduce((prev, cur) => {
			const [maxPos, maxDist] = prev as [Vector2D, number];
			const curDist = distance(cur.position, actor.position);
			if (curDist > maxDist)
				return [cur.position, curDist];
			return [maxPos, maxDist];
		}, [createVector(-1, -1), -Infinity]);
	const actorIndices = actors.filter((a) => isDeepStrictEqual(a.position, closestPos)).map((a, i) => i);
	const composedActors = actorIndices.map((i) => {
		const childActor = actors[i];
		const actions = Object.entries(childActor.actions).reduce((oldObject, [key, value]) => {
			if (key !== "move")
				return {...oldObject, key: value};
			else {
				return {...oldObject, key: paralyzeMove};
			}
		}, {});

		return {
			...childActor,
			actions,
			externalProps: {
				...childActor.externalProps,
				childActor
			}
		};
	});
	return { actorIndices, composedActors };
}

export { temperatureRise, heal, convertEnemies, enemyFlee, spawn, moveRight, catapultParalyze };