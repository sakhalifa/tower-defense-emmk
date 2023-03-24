import { World } from "./world";

function initWorld(): World{

}

function initPhases(): Array<("move")>{

}

function computeNewWorld(w: World, phases: Array<("move")>){

}

function initActors() {
	
}

function main() {
	let world = initWorld();
	let phases = initPhases();
	let actors = initActors();
	let finished = false;
	let i = 0;
	while (!finished){
		world = computeNewWorld(world, phases);
		finished = ++i > 50;
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