import { World, isPositionInWorld, worldToString, createWorld } from "./world";
import { Phase } from "./phase";
import { Actor, createActor } from "./actor";
import { createPhase } from "./phase";
import { createVector, translatePoint } from "./geometry";

function initWorld(): World {
	return createWorld(7, 7, initActors());
}

function initPhases(): Array<Phase> {
	return [createPhase("move", (oldActors, phaseResults) => {
		return phaseResults.map((v, i) => { return { ...oldActors[i], pos: translatePoint(oldActors[i].pos, v) }; });
	})];
}

function initActors(): Array<Actor> {
	return [createActor(createVector(0, 0), { move: (w, a) => createVector(1, 0) })];
}

function validNewActor(world: World, actor: Actor): boolean {
	return isPositionInWorld(world, actor.pos);
}

function resolveProposals(world: World, proposals: Array<Actor>): World {
	const resolvedActors: Array<Actor> = proposals.reduce((acc: Array<Actor>, currentProposal: Actor, i: number) => {
		if (validNewActor(world, currentProposal)) {
			return acc.concat(currentProposal);
		} else {
			return acc.concat(world.actors[i]); // doesn't check old position new state
		}
	}, []);
	return { height: world.height, width: world.width, actors: resolvedActors };
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
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					aWorld.actors.map((anActor) => anActor.actions[funcName](aWorld, anActor))
				);
			const aNewWorld = resolveProposals(aWorld, proposals);
			return aNewWorld;
		}, world);
		console.log(worldToString(world));
		finished = i++ === 5;
	}
}

main();