import { Matrix, matrixToString } from "./geometry";
import { World } from "./world";
import { Phase } from "./phase";
import { Actor } from "./actor";
import { createPhase } from "./phase";

function initWorld(): World {
	throw Error();
}

function initPhases(): Array<("move")> {
	throw Error();

}

function initPhases(): Array<Phase> {
	return [createPhase("move", (a: Actor, w: World) => a)];
}

function computeNewWorld(w: World, phases: Array<("move")>): World {
	throw Error()
}

function initActors() {
	throw Error()
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