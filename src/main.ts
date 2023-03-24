import { World } from "./world";
import { Phase } from "./phase";

function initWorld(): World {

}

function initPhases(): Array<Phase> {

}

function computeNewWorld(w: World, phases: Array<(string)>) {

}

function initActors() {

}

function main() {
	let world = initWorld();
	let phases = "move";
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