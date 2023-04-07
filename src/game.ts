import type { World } from "./world";
import { isPositionInWorld, createWorld } from "./world";
import { Phase } from "./phase";
import { Actor, createActor } from "./actor";
import { createPhase } from "./phase";
import { createVector, translatePoint } from "./geometry";

function initWorld(): World {
	return createWorld(7, 7, initActors());
}

function initPhases(): Array<Phase> {
	return [
		createPhase("move", (oldActors, phaseResults) => {
			return phaseResults.map((v, i) => { return { ...oldActors[i], pos: translatePoint(oldActors[i].pos, v) }; });
		}),
		createPhase("heal", (oldActors, phaseResults) => {
			return oldActors.map((a, i) => {
				return phaseResults.reduce((prev, v) => (i === v.actorId) ? { ...a, faith_point: ((a.faith_point ?? 0) + v.amount) } : a, a);
			});
		})];
}

function move_right(w: World, a: Actor) {
	return createVector(1, 0);
}

function heal(w: World, a: Actor) {
	if (a.tags?.includes("healer")) {
		return { actorId: 0, amount: 1 };
	}
	return { actorId: 0, amount: 0 };
}

function initActors(): Array<Actor> {
	return [createActor(createVector(0, 0), { move: move_right, heal: heal }, undefined, undefined, undefined),
			createActor(createVector(0, 1), { move: move_right, heal: heal }, ["healer"], undefined, undefined)];
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

function playGame(display: (world: World) => void) {
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
		display(world);
		finished = i++ === 5;
	}
}


export { playGame };