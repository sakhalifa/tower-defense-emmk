import type { ActorActions } from "./actor_actions";
import type { Actor } from "./actor";

import { translateAndUpdateWaypoint} from "./actor";
import { sum } from "./util";
import { createGoodGuy } from "./actor_creators";
import { Vector2D } from "./geometry";

/**
 * The executePhase function for the "spawn" phase.
 * All it does is spawn new actors if there are to be spawned.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "spawn" phase
 */
function spawnPhase(oldActors: Array<Actor>, phaseResult: Array<ReturnType<ActorActions["spawn"]>>): Array<Actor> {
	return oldActors.concat((phaseResult.filter((returnedActor) => returnedActor !== undefined)) as Array<Actor>);
}

/**
 * The executePhase function for the "spawn" phase.
 * All it does is spawn new actors if there are to be spawned.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "spawn" phase
 */
function playPhase(oldActors: Array<Actor>, phaseResult: Array<ReturnType<ActorActions["play"]>>): Array<Actor> {
	return oldActors.concat(phaseResult.filter((returnedVector) => returnedVector !== undefined).map((vector: Vector2D) => createGoodGuy(vector))) as Array<Actor>;
}

/**
 * The executePhase function for the "temperatureRise" phase.
 * It inflicts damage to the Spaghetti Monster, our defense target.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "temperatureRise" phase
 */
function temperatureRisePhase(oldActors: Array<Actor>, phaseResult: Array<ReturnType<ActorActions["temperatureRise"]>>): Array<Actor> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return oldActors.map((a) => a.kind !== "spaghettiMonster" ? a : { ...a, faithPoints: a.faithPoints! - sum(phaseResult) });
}

function movePhase(oldActors: Array<Actor>, movementVectors: Array<ReturnType<ActorActions["move"]>>): Array<Actor> {
	return movementVectors.map((movementVector, actorIndex) => translateAndUpdateWaypoint(oldActors, oldActors[actorIndex], movementVector));
}

function updateIgnorance(actor: Actor, actorIndex: number, spreadIgnoranceResults: Array<ReturnType<ActorActions["spreadIgnorance"]>>): Actor {
	return {
		...actor,
		faithPoints: spreadIgnoranceResults.reduce((ignoranceAcc, spreadIgnoranceResult) =>
					(ignoranceAcc ?? 0) + ((spreadIgnoranceResult.amount[spreadIgnoranceResult.actorIndices.indexOf(actorIndex)] ?? 0)),
					actor.faithPoints)
	};
}

/**
 * The executePhase function for the "spreadIgnorance" phase.
 * It ensures all enemies who receive the faithPoints have actually more faithPoints.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "spreadIgnorance" phase
 */
function spreadIgnorancePhase(oldActors: Array<Actor>, spreadIgnoranceVectors: Array<ReturnType<ActorActions["spreadIgnorance"]>>): Array<Actor> {
	return oldActors.map((currentActor, actorIndex) => updateIgnorance(currentActor, actorIndex, spreadIgnoranceVectors));
}

/**
 * The executePhase function for the "convertEnemies" phase.
 * It ensures all ignorants get slowly converted to our holy faith; pastafarism.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the pase
 * @returns A proposal for the actors after executing the "convertEnemies" phase
 */
function convertEnemiesPhase(oldActors: Array<Actor>, phaseResult: Array<ReturnType<ActorActions["convertEnemies"]>>): Array<Actor> {
	return oldActors.map((a, i) => phaseResult.reduce((actor, curResult) => {
		const idx = curResult.actorIndices.indexOf(i);
		if (idx !== -1) {
			const fp = actor.faithPoints ?? 0;
			return { ...actor, faithPoints: fp - curResult.amount[idx] };
		}
		return actor;
	}, a));
}

/**
 * The executePhase function for the "enemyFlee" phase.
 * It removes the actors that have decided to not exist anymore.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "enemyFlee" phase
 */
function enemyFleePhase(oldActors: Array<Actor>, phaseResult: Array<ReturnType<ActorActions["enemyFlee"]>>): Array<Actor> {
	return oldActors.filter((a, i) => !phaseResult[i]);
}

export { spawnPhase, temperatureRisePhase, spreadIgnorancePhase, convertEnemiesPhase, enemyFleePhase, movePhase, playPhase };