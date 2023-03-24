import { World } from "./world";

function initWorld(): World{

}

function initPhases(): Array<(string)>{

}

function computeNewWorld(w: World, phases: Array<(string)>){

}

function initActors() {
	
}

function main() {
	let world = initWorld();
	let phases = initPhases();
	let actors = initActors();
	let finished = false;
	while (!finished){
		[world, actors] = phases.reduce(([aWorld, actors], aPhase) => {
			funcName  = aPhase.funcName
			proposals = actors.map((anActor) =>
							anActor.funcName(anActor, aWorld));
			[aNewWorld, newActors] = resolveProposals(aWorld, actors, proposals);
			return [aNewWorld, newActors];
		},
		[world, actors])
	}
}

main();