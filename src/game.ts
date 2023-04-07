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
			return phaseResults.map((move_vector, i) => { return { ...oldActors[i], pos: translatePoint(oldActors[i].pos, move_vector) }; });
		}),
		createPhase("heal", (oldActors, phaseResults) => {
			return oldActors.map((current_actor, i) => {
				//return phaseResults.reduce((current_actor_acc, heals_vector) => (heals_vector.actorId.includes(i)) ? { ...current_actor_acc, 
				//	faith_point: (current_actor.faith_point === undefined ? heals_vector.amount : current_actor.faith_point + heals_vector.amount[i]) } : current_actor, current_actor);
				return {...current_actor, faith_point: current_actor.faith_point === undefined ? undefined : 
					phaseResults.reduce((faith_point_acc, heals_vector) => 
					(heals_vector.actorIds.includes(i)) ? 
					faith_point_acc + heals_vector.amount[heals_vector.actorIds.indexOf(i)] : faith_point_acc, current_actor.faith_point)}; // includes + indexOf is bad for optimisation
			});
		})];
}

function move_right(w: World, a: Actor) {
	return createVector(1, 0);
}

function heal(w: World, a: Actor) {
	if (a.tags?.includes("healer")) {
		return { actorIds: [0], amount: [1] };
	}
	return { actorIds: [0], amount: [0] };
}

function initActors(): Array<Actor> {
	return [createActor(createVector(0, 0), { move: move_right, heal: heal }, 0, "ignorant"),
			createActor(createVector(0, 1), { move: move_right, heal: heal }, 0, "ignorant", ["healer"])];
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

function nextTurn(phases: Array<Phase>, world: World){
	return phases.reduce((aWorld, aPhase) => {
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
}

function playGame(display: (world: World) => void) {
	let world: World = initWorld();
	const phases: Array<Phase> = initPhases();
	let finished: boolean = false;
	let i = 0;
	while (!finished) {
		world = nextTurn(phases, world);
		display(world);
		finished = i++ === 5;
	}
}


export { playGame, initWorld, initPhases, nextTurn };