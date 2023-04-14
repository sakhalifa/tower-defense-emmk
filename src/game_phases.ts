import { Actor, translateActor } from "./actor";
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

function movePhase(oldActors: Array<Actor>, movementVectors: Array<ActionReturnTypes["move"]>): Array<Actor> {
	return movementVectors.map((movementVector, actorIndex) => translateActor(oldActors[actorIndex], movementVector));
}

function updateFaithPoints(actor: Actor, actorIndex: number, healResults: Array<ActionReturnTypes["heal"]>): Actor {
	return {
		...actor,
		faithPoints: healResults.reduce((faithPointsAcc, healResult) =>
			(faithPointsAcc ?? 0) + ((healResult.amount[healResult.actorIndices.indexOf(actorIndex)] ?? 0)),
			actor.faithPoints)
	};
}

/**
 * The executePhase function for the "heal" phase.
 * It ensures all enemies healed are actually healed.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "heal" phase
 */
function healPhase(oldActors: Array<Actor>, healVectors: Array<ActionReturnTypes["heal"]>): Array<Actor> {

	return oldActors.map((currentActor, actorIndex) => updateFaithPoints(currentActor, actorIndex, healVectors));
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

function paralyzePhase(oldActors: Array<Actor>, paralyzeResults: Array<ActionReturnTypes["paralyze"]>): Array<Actor> {
	return oldActors.map((a, i) =>
		paralyzeResults.reduce((prevActor, paralyzeResult) =>
			paralyzeResult.composedActor[paralyzeResult.actorIndices.indexOf(i)] ?? prevActor, a));
}

export { spawnPhase, temperatureRisePhase, healPhase, convertEnemiesPhase, enemyFleePhase, movePhase, paralyzePhase };