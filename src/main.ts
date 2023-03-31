import { World, isPositionInWorld, worldToString } from "./world";
import { ActionReturnTypes, Phase } from "./phase";
import { Actor } from "./actor";
import { createPhase } from "./phase";
import { translatePoint } from "./geometry";

function initWorld(): World {
	let actors: Array<Actor> = initActors();
	throw Error();
}

function initPhases(): Array<Phase> {
	return [{
		funcName: "move", executePhase: (oldActors, phaseResults) => {
			return phaseResults.map((v, i) => { return { ...oldActors[i], pos: translatePoint(oldActors[i].pos, v) }; });
		}
	}];
}

function computeNewWorld(w: World, phases: Array<Phase>): World {
	throw Error();
}

function initActors(): Array<Actor> {
	throw Error();
}

function validNewActor(world: World, actor: Actor): boolean {
	return isPositionInWorld(world, actor.pos);
}

function resolveProposals(world: World, proposals: Array<Actor>): World {
	const resolvedActors: Array<Actor> = proposals.reduce((acc: Array<Actor>, currentProposal: Actor, i: number) => {
		if (validNewActor(world, currentProposal)) {
			return acc.concat(currentProposal);
		} else {
			return acc.concat(world.actors[i]);
		}
	}, []);
	return world;
}

function main() {
	let world: World = initWorld();
	const phases: Array<Phase> = initPhases();
	let finished: boolean = false;
	let i = 0;
	while (!finished) {
		world = phases.reduce((aWorld, aPhase) => {
			const funcName: string = aPhase.funcName;
			const proposals: Actor[]//Array<ActionReturnTypes[keyof ActionReturnTypes]>
				= aPhase.executePhase(aWorld.actors,
					// @ts-expect-error ts bug
					aWorld.actors.map((anActor) => anActor.actions[aPhase.funcName](aWorld, anActor))
				);
			const aNewWorld = resolveProposals(aWorld, proposals);
			return aNewWorld;
		}, world);
		console.log(worldToString(world));

		finished = i++ > 5;
	}
}

main();