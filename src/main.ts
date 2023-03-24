import { Matrix, matrixToString } from "./geometry";
import { World } from "./world";
import { Phase } from "./phase";

function initWorld(): World {
	throw Error();
}

function initPhases(): Array<("move")> {
	throw Error();

}

function computeNewWorld(w: World, phases: Array<("move")>): World {
	throw Error()
}

function initActors() {

}

function main() {
	let world = initWorld()
	let phases = initPhases()
	let finished = false
	let i = 0;
	while (!finished){
		world = computeNewWorld(world, phases)
		finished = ++i > 50
	}
	/*
	world  = initializeWorld()
	actors = initializeActors()
	phases = computePhases(actors)
	while the game is not over
		[world, actors] = phases.reduce(([aWorld, actors], aPhase) => {
				funcName  = aPhase.funcName
				proposals = actors.map((anActor) =>
								anActor.funcName(anActor, aWorld));
				[aNewWorld, newActors] = resolveProposals(aWorld, actors, proposals);
				return [aNewWorld, newActors];
			},
			[world, actors]); */
}

main();