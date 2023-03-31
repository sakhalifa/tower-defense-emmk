import { World, isPositionInWorld } from "./world";
import { ActionReturnTypes, Phase } from "./phase";
import { Actor } from "./actor";
import { createPhase } from "./phase";

function initWorld(): World {
	let actors: Array<Actor> = initActors();
	throw Error();
}

function initPhases(): Array<Phase> {
	throw Error();
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
	const resolvedActors: Array<Actor> = proposals.reduce((acc: Array<Actor>, currentProposal: Actor, i: number) => {
		if (validNewActor(world, currentProposal)) {
			return acc.concat(currentProposal);
		} else {
			return acc.concat(actors[i]);
		}
	}, []);
	return [world, resolvedActors];
}

function main() {
	let world: World = initWorld();
	const phases: Array<Phase> = initPhases();
	let finished: boolean = false;
	while (!finished) {
		[world, actors] = phases.reduce(([aWorld, someActors], aPhase) => {
			const funcName: string = aPhase.funcName;
			const proposals: Actor[]//Array<ActionReturnTypes[keyof ActionReturnTypes]>
			= aPhase.executePhase(
					// @ts-expect-error ts bug
					someActors.map((anActor) => anActor.actions[aPhase.funcName](aWorld, anActor))
					);
			const [aNewWorld, newActors] = resolveProposals(aWorld, someActors, proposals);
			return [aNewWorld, newActors];
		}, [world, actors]);
	}
}

main();