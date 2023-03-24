import { World } from "./world";
import { Phase } from "./phase";
import { Actor } from "./actor";
import * as Actor_i from "./actor";

function initWorld(): World {

}

function initPhases(): Array<Phase> {
	return [Actor_i.createPhase("move", (a : Actor, w : World) => a)];
}

function computeNewWorld(w: World, phases: Array<(string)>) {

}

function initActors() {

}

function main() {
	let world = initWorld();
	let phases = initPhases();
	let actors = initActors();
	let finished = false;
	while (!finished) {
		[world, actors] = phases.reduce(([aWorld, actors], aPhase) => {
			funcName: string = aPhase.funcName;
			proposals = actors.map((anActor) =>
				anActor.funcName(anActor, aWorld));
			[aNewWorld, newActors] = resolveProposals(aWorld, actors, proposals);
			return [aNewWorld, newActors];
		},
			[world, actors])
	}
}

main();