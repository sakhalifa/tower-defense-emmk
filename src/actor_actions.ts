import { isDeepStrictEqual } from "util";
import { Actor, createHealer, createIgnorant } from "./actor";
import type { ActionReturnTypes, Phase } from "./phase";
import { World } from "./world";
import { distance } from "./geometry";

function spawn(world: World, actor: Actor): ActionReturnTypes["spawn"] {
	if (Math.random() < 0.5)
		return undefined;
	else {
		if (Math.random() < 0.5)
			return createIgnorant();
		else
			return createHealer();
	}
}

function temperatureRise(world: World, actor: Actor): ActionReturnTypes["temperatureRise"] {
	return world.actors.find((a) => a.kind === "boss" && isDeepStrictEqual(a.pos, actor.pos)) === undefined
		? 0 : (actor.externalProps.attackPower ?? 1);
}

function heal(world: World, actor: Actor): ActionReturnTypes["heal"] {
	const range = actor.externalProps.range ?? 3;
	const actorIds = world.actors.filter((a) => a !== actor && a.kind === "ignorant" && distance(a.pos, actor.pos) <= range).map((a, i) => i);
	const amount = actorIds.map((_) => actor.externalProps.healPower ?? 1);
	return { actorIds, amount };
}

function convertEnemies(world: World, actor: Actor): ActionReturnTypes["convertEnemies"] {
	const range = actor.externalProps.range ?? 3;
	const actorIds = world.actors.filter((a) => a !== actor && a.kind !== "ignorant" && distance(a.pos, actor.pos) <= range).map((a, i) => i);
	const amount = actorIds.map((_) => actor.externalProps.attackPower ?? 1);
	return { actorIds, amount };
}

function enemyFlee(world: World, actor: Actor): ActionReturnTypes["enemyFlee"] {
	return (actor.faith_point ?? 0) <= 0;
}

export { temperatureRise, heal, convertEnemies, enemyFlee, spawn };