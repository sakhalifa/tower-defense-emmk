import { Actor } from "./actor";
import { ActionReturnTypes } from "./phase";
import { sum } from "./util";

/**
 * The executePhase function for the "spawn" phase.
 * All it does is spawn new actors if there are to be spawned.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "spawn" phase
 */
function spawnPhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["spawn"]>): Array<Actor> {
	return oldActors.concat(phaseResult.filter((v) => v !== undefined) as Array<Actor>);
}

/**
 * The executePhase function for the "temperatureRise" phase.
 * It inflicts damage to the Spaghetti Monster, our defense target.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "temperatureRise" phase
 */
function temperatureRisePhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["temperatureRise"]>): Array<Actor> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return oldActors.map((a) => a.kind !== "spaghettimonster" ? a : { ...a, faith_point: a.faithPoints! - sum(phaseResult) });
}

/**
 * The executePhase function for the "heal" phase.
 * It ensures all enemies healed are actually healed.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "heal" phase
 */
function healPhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["heal"]>): Array<Actor> {
	return oldActors.map((a, i) => phaseResult.reduce((actor, curResult) => {
		const idx = curResult.actorIndices.findIndex((id) => id === i);
		if (idx !== -1) {
			const fp = actor.faithPoints ?? 0;
			return { ...actor, faith_point: fp + curResult.amount[idx] };
		}
		return actor;
	}, a));
}

/**
 * The executePhase function for the "convertEnemies" phase.
 * It ensures all ignorants get slowly converted to our holy faith; pastafarism.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the pase
 * @returns A proposal for the actors after executing the "convertEnemies" phase
 */
function convertEnemiesPhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["convertEnemies"]>): Array<Actor> {
	return oldActors.map((a, i) => phaseResult.reduce((actor, curResult) => {
		const idx = curResult.actorIndices.findIndex((id) => id === i);
		if (idx !== -1) {
			const fp = actor.faithPoints ?? 0;
			return { ...actor, faith_point: fp - curResult.amount[idx] };
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
function enemyFleePhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["enemyFlee"]>): Array<Actor> {
	return oldActors.filter((a, i) => !phaseResult[i]);
}

export { spawnPhase, temperatureRisePhase, healPhase, convertEnemiesPhase, enemyFleePhase };