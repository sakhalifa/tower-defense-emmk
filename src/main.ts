import { Matrix, matrixToString } from "./geometry";
import { World } from "./world";

function initWorld(): World {
	throw Error();
}

function initPhases(): Array<("move")> {
	throw Error();

}

function computeNewWorld(w: World, phases: Array<("move")>): World {
	throw Error()
}


function main() {
	const m: Matrix<number> = [[1, 2, 3, 4], [4, 5, 6, 7]];
	console.log(matrixToString(m, (e) => e.toString()));
	// let world = initWorld();
	// const phases = initPhases();
	// let finished = false;
	// let i = 0;
	// while (!finished) {
	// 	world = computeNewWorld(world, phases);
	// 	finished = ++i > 50;
	// }
	// /*
	// world  = initializeWorld()
	// actors = initializeActors()
	// phases = computePhases(actors)
	// while the game is not over
	// 	[world, actors] = phases.reduce(([aWorld, actors], aPhase) => {
	// 			funcName  = aPhase.funcName
	// 			proposals = actors.map((anActor) =>
	// 							anActor.funcName(anActor, aWorld));
	// 			[aNewWorld, newActors] = resolveProposals(aWorld, actors, proposals);
	// 			return [aNewWorld, newActors];
	// 		},
	// 		[world, actors]); */
}

main();