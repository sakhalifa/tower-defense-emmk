import type { World } from "./world";
import { isPositionInWorld, createWorld } from "./world";
import { Phase } from "./phase";
import { Actor, createActor, translateActor, updateFaithPoints } from "./actor";
import { createPhase } from "./phase";
import { createVector } from "./geometry";

function initWorld(): World {
	return createWorld(7, 7, initActors());
}

function initPhases(): Array<Phase> {
	return [
		createPhase("move", (oldActors, movementVectors) => {
			return movementVectors.map((movementVector, actorIndex) =>
				translateActor(oldActors[actorIndex], movementVector));
		}),
		createPhase("heal", (oldActors, healVectors) => {
			return oldActors.map((currentActor, actorIndex) =>
				updateFaithPoints(currentActor, actorIndex, healVectors));
		})];
}

function moveRight(w: World, a: Actor) {
	return createVector(1, 0);
}

function heal(w: World, a: Actor) {
	if (a.kind === "healer") {
		return { actorIndices: [0], amount: [1] };
	}
	return { actorIndices: [], amount: [] };
}

function initActors(): Array<Actor> {
	return [createActor(createVector(0, 0), { move: moveRight, heal: heal }, "ignorant", undefined, undefined, 0),
	createActor(createVector(0, 1), { move: moveRight, heal: heal }, "healer", undefined, undefined, 0)];
}

function validNewActor(world: World, actor: Actor): boolean {
	return isPositionInWorld(world, actor.pos);
}

function resolveProposals(world: World, proposals: Array<Actor>): World {
	const resolvedActors: Array<Actor> = proposals.reduce((acc: Array<Actor>, currentProposal: Actor, i: number) => {
		if (validNewActor(world, currentProposal)) {
			return acc.concat(currentProposal);
		} else {
			return acc.concat(world.actors[i]); // doesn't check old position new state -> possible collisions etc
		}
	}, []);
	return { height: world.height, width: world.width, actors: resolvedActors };
}

function nextTurn(phases: Array<Phase>, world: World) {
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