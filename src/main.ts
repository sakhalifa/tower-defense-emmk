import { Matrix, matrixToString } from "./geometry";
import { World, isPositionInWorld } from "./world";
import { Phase } from "./phase";
import { Actor } from "./actor";
import { createPhase } from "./phase";

function initWorld(): World {
	throw Error();
}

function initPhases(): Array<Phase> {
	return [createPhase("move", (a: Actor, w: World) => a)];
}

function computeNewWorld(w: World, phases: Array<Phase>): World {
	throw Error();
}

function initActors(): Array<Actor> {
	throw Error()
}

function validNewActor(world: World, actor: Actor): boolean {
	return isPositionInWorld(world, actor.pos);
}

function resolveProposals(world: World, actors: Array<Actor>, proposals: Array<Actor>): [World, Array<Actor>] {
	let resolvedActors: Array<Actor> = proposals.reduce((acc, currentProposal, i) => {
		if (validNewActor(world, currentProposal)) {
			acc.concat(currentProposal);
		} else {
			acc.concat(actors[i]);
		}
	}, []);
	return [world, resolvedActors];
}

function main() {
	let world: World = initWorld();
	let phases: Array<Phase> = initPhases();
	let actors: Array<Actor> = initActors();
	let finished: boolean = false;
	while (!finished) {
		[world, actors] = phases.reduce(([aWorld, someActors], aPhase) => {
			const funcName: string = aPhase.funcName;
			let proposals = someActors.map((anActor) =>
				anActor.actions[funcName](anActor, aWorld));
			let [aNewWorld, newActors] = resolveProposals(aWorld, someActors, proposals);
			return [aNewWorld, newActors];
		}, [world, actors])
	}
}

main();