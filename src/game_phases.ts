import type { ActorActions } from "./actor_actions";
import { Actor, hasOneOfKinds, walkerKeys } from "./actor";

import { translateAndUpdateWaypoint} from "./actor";
import { sum } from "./util";
import { createGoodGuy } from "./actor_creators";
import { Vector2D } from "./geometry";
import { getFaithPoints, setFaithPoints } from "./props";

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

function updateIgnorance(actor: Actor, actorIndex: number, spreadIgnoranceResults: Array<ReturnType<ActorActions["spreadIgnorance"]>>): Actor {
	return setFaithPoints(actor, 
		spreadIgnoranceResults.reduce((ignoranceAcc, spreadIgnoranceResult) =>
					ignoranceAcc + (spreadIgnoranceResult.amount[spreadIgnoranceResult.actorIndices.indexOf(actorIndex)] ?? 0),
					getFaithPoints(actor))
	);
}

/**
 * The executePhase function for the "spreadIgnorance" phase.
 * It ensures all enemies who receive the faithPoints have actually more faithPoints.
 * @param oldActors The actors before the phase
 * @param phaseResult The results of the phase
 * @returns A proposal for the actors after executing the "spreadIgnorance" phase
 */
function spreadIgnorancePhase(oldActors: Array<Actor>, spreadIgnoranceVectors: Array<ReturnType<ActorActions["spreadIgnorance"]>>): Array<Actor> {
	return oldActors.map((currentActor, actorIndex) => 
		hasOneOfKinds(currentActor, [...walkerKeys, "spaghettiMonster"]) ?
		updateIgnorance(currentActor, actorIndex, spreadIgnoranceVectors) :
		currentActor
	);
}

/**
 * The executePhase function for the "convertEnemies" phase.
 * It ensures all ignorants get slowly converted to our holy faith; pastafarism.
 * @param oldActors The actors before the phase
 * @param convertIgnorantsVectors The results of the phase
 * @returns A proposal for the actors after executing the "convertEnemies" phase
 */
function convertIgnorantsPhase(oldActors: Array<Actor>, convertIgnorantsVectors: Array<ReturnType<ActorActions["convertEnemies"]>>): Array<Actor> {
	return oldActors.map((currentActor, actorIndex) => 
		hasOneOfKinds(currentActor, [...walkerKeys]) ?
		updateIgnorance(currentActor, actorIndex, convertIgnorantsVectors.map((v) => ({actorIndices: v.actorIndices, amount: v.amount.map((a) => -a)}))) :
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

export { spawnPhase, temperatureRisePhase, spreadIgnorancePhase, convertIgnorantsPhase as convertEnemiesPhase, enemyFleePhase, movePhase, playPhase };