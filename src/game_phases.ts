import { Actor } from "./actor";
import { ActionReturnTypes } from "./phase";
import { sum } from "./util";

function spawnPhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["spawn"]>): Array<Actor> {
	return oldActors.concat(phaseResult.filter((v) => v !== undefined) as Array<Actor>);
}

function temperatureRisePhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["temperatureRise"]>): Array<Actor> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return oldActors.map((a) => a.kind !== "boss" ? a : { ...a, faith_point: a.faith_point! - sum(phaseResult) });
}

function healPhase(oldActors: Array<Actor>, phaseResult: Array<ActionReturnTypes["heal"]>): Array<Actor> {
	oldActors.map((a, i) => {
		const idx = phaseResult.findIndex((v) => v.actorIds.includes(i));
		if (idx !== -1) {
			return 
		}
		return a;
	});

	return [];
}

export { spawnPhase, temperatureRisePhase };