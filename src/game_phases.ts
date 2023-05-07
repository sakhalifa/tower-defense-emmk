import type { ActorActions } from "./actor_actions";
import { Actor, hasOneOfKinds, walkerKeys } from "./actor";

import { translateAndUpdateWaypoint} from "./actor";
import { sum } from "./util";
import { createGoodGuy } from "./actor_creators";
import { Vector2D } from "./geometry";
import { getFaithPoints, getMaxFaith, setFaithPoints } from "./props";
import { impactActorsConviction } from "./actor_actions";

/**
 * The executePhase function for the "spawn" phase.
 * All it does is spawn new actors if there are to be spawned.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "spawn" phase
 */
function spawnPhase(oldActors: Array<Actor>, phaseResult: Array<ReturnType<ActorActions["spawn"]>>): Array<Actor> {
	return oldActors.concat(
		phaseResult
		.filter((returnedActor): returnedActor is Actor => returnedActor !== undefined)
	);
}

/**
 * The executePhase function for the "spawn" phase.
 * All it does is spawn new actors if there are to be spawned.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "spawn" phase
 */
function playPhase(oldActors: Array<Actor>, phaseResult: Array<ReturnType<ActorActions["play"]>>): Array<Actor> {
	return oldActors.concat(
		phaseResult
		.filter((returnedVector) => returnedVector !== undefined)
		.map((vector: Vector2D) => createGoodGuy(vector))
	);
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
	return oldActors.map((currentActor) => hasOneOfKinds(currentActor, ["spaghettiMonster"]) ?
	setFaithPoints(currentActor, getFaithPoints(currentActor) - sum(phaseResult)):
	currentActor);
}

function movePhase(oldActors: Array<Actor>, movementVectors: Array<ReturnType<ActorActions["move"]>>): Array<Actor> {
	return movementVectors.map((movementVector, actorIndex) => translateAndUpdateWaypoint(oldActors, oldActors[actorIndex], movementVector));
}

function updateIgnorance(actor: Actor, actorIndex: number, spreadConvictionResults: Array<ReturnType<typeof impactActorsConviction>>): Actor {
	return setFaithPoints(actor, 
		Math.min(spreadConvictionResults.reduce((ignoranceAcc, spreadIgnoranceResult) =>
					ignoranceAcc + (spreadIgnoranceResult.impactAmounts[spreadIgnoranceResult.impactedActorsIndices.indexOf(actorIndex)] ?? 0),
					getFaithPoints(actor)), getMaxFaith(actor))
	);
}

/**
 * The executePhase function for the phase about converting people to a religion.
 * Ignorants can get slowly converted to our holy faith; pastafarism, or they could be comforted in their ignorance...
 * @param oldActors The actors before the phase
 * @param spreadConvictionVectors The results of the phase
 * @returns A proposal for the actors after executing the "convertEnemies" phase
 */
function spreadConvictionPhase(oldActors: Array<Actor>, spreadConvictionVectors: Array<ReturnType<typeof impactActorsConviction>>): Array<Actor> {
	return oldActors.map((currentActor, actorIndex) => 
		hasOneOfKinds(currentActor, [...walkerKeys, "spaghettiMonster"]) ?
		updateIgnorance(currentActor, actorIndex, spreadConvictionVectors) :
		currentActor
	);
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

function paralyzePhase(oldActors: Array<Actor>, paralyzeResults: Array<ReturnType<ActorActions["paralyze"]>>): Array<Actor> {
	return oldActors.map((a, i) =>
		paralyzeResults.reduce((prevActor, paralyzeResult) =>
			paralyzeResult.composedActors[paralyzeResult.actorIndices.indexOf(i)] ?? prevActor, a));
}

function removeEffectsPhase(oldActors: Array<Actor>, removeEffectsResults: Array<ReturnType<ActorActions["removeEffects"]>>): Array<Actor> {
	return oldActors.filter((a, i) => removeEffectsResults[i]);
}

export { spawnPhase, temperatureRisePhase, spreadConvictionPhase, enemyFleePhase, movePhase, playPhase, paralyzePhase, removeEffectsPhase };
