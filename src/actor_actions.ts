import { isDeepStrictEqual } from "util";
import { Actor, createHealer, createIgnorant } from "./actor";
import type { ActionReturnTypes, Phase } from "./phase";
import { distance } from "./geometry";

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

function temperatureRise(actors: Array<Actor>, actor: Actor): ActionReturnTypes["temperatureRise"] {
	return actors.find((a) => a.kind === "spaghettimonster" && isDeepStrictEqual(a.position, actor.position)) === undefined
		? 0 : (actor.externalProps.attackPower ?? 1);
}

function heal(actors: Array<Actor>, actor: Actor): ActionReturnTypes["heal"] {
	const range = actor.externalProps.range ?? 3;
	const actorIndices = actors.filter((a) => a !== actor && a.kind === "ignorant" && distance(a.position, actor.position) <= range).map((a, i) => i);
	const amount = actorIndices.map((_) => actor.externalProps.healPower ?? 1);
	return { actorIndices, amount };
}

function convertEnemies(actors: Array<Actor>, actor: Actor): ActionReturnTypes["convertEnemies"] {
	const range = actor.externalProps.range ?? 3;
	const actorIndices = actors.filter((a) => a !== actor && a.kind !== "ignorant" && distance(a.position, actor.position) <= range).map((a, i) => i);
	const amount = actorIndices.map((_) => actor.externalProps.attackPower ?? 1);
	return { actorIndices, amount };
}

function enemyFlee(actors: Array<Actor>, actor: Actor): ActionReturnTypes["enemyFlee"] {
	if (actor.kind === "ground" || actor.kind === "goodGuy")
		return false;
	return (actor.faithPoints ?? 0) <= 0;
}

export { temperatureRise, heal, convertEnemies, enemyFlee, spawn };