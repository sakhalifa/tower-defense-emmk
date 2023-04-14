import { Actor } from "./actor";
import { ActionReturnTypes } from "./phase";
import { sum } from "./util";

function spawnPhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["spawn"]>): Array<Actor> {
	return oldActors.concat(phaseResult.filter((v) => v !== undefined) as Array<Actor>);
}

function temperatureRisePhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["temperatureRise"]>): Array<Actor> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return oldActors.map((a) => a.kind !== "boss" ? a : { ...a, faith_point: a.faithPoints! - sum(phaseResult) });
}

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

function enemyFleePhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["enemyFlee"]>): Array<Actor> {
	return oldActors.filter((a, i) => !phaseResult[i]);
}

export { spawnPhase, temperatureRisePhase, healPhase, convertEnemiesPhase, enemyFleePhase };