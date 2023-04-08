import type { World } from "./world";
import { isPositionInWorld, createWorld, worldToString } from "./world";
import { ActionReturnTypes, Phase } from "./phase";
import { Actor, createActor, translateActor, updateFaithPoints, actorToStringInWorld, actorToString } from "./actor";
import { createPhase } from "./phase";
import { createVector } from "./geometry";

function initWorld(width: number, height: number): World {
	return createWorld(width, height);
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

function moveRight(actors: Array<Actor>, a: Actor): ActionReturnTypes["move"] {
	return createVector(1, 0);
}

function heal(actors: Array<Actor>, a: Actor): ActionReturnTypes["heal"] {
	if (a.kind === "healer") {
		return { actorIndices: [0], amount: [1] };
	}
	return { actorIndices: [], amount: [] };
}
// not pure
function initWayPoints(world: World): Array<Actor> {
	return [
		createActor(createVector(0, 0), {}, "entry", { wayPointNumber: 0 }),
		createActor(createVector(world.width / 3, world.height / 3), {}, "ground", { wayPointNumber: 1 }),
		createActor(createVector(2 * world.width / 3, 2 * world.height / 3), {}, "ground", { wayPointNumber: 2 }),
		createActor(createVector(world.width, world.height), {}, "exit", { wayPointNumber: 3 })
	];
}
//not pure
function initOtherActors(world: World, entries: Array<Actor>): Array<Actor> {
	return [
		createActor(createVector(0, 0), { move: moveRight, heal: heal }, "ignorant", undefined, undefined, 0),
		createActor(createVector(0, 1), { move: moveRight, heal: heal }, "healer", undefined, undefined, 0)
	];
}

function findEntries(actors: Array<Actor>): Array<Actor> {
	return actors.reduce((entries: Array<Actor>, currentActor: Actor) => currentActor.kind === "entry" ? entries.concat(currentActor) : entries, []);
}
//not pure
function initActors(world: World): Array<Actor> {
	const path = initWayPoints(world);
	return path.concat(initOtherActors(world, findEntries(path)));
}

function validNewActor(world: World, actor: Actor): boolean {
	return isPositionInWorld(world, actor.position);
}

function resolveProposals(world: World, actors: Array<Actor>, proposals: Array<Actor>): Array<Actor> {
	return proposals.reduce((acc: Array<Actor>, currentProposal: Actor, actorIndex: number) => {
		if (validNewActor(world, currentProposal)) {
			return acc.concat(currentProposal);
		} else {
			return acc.concat(actors[actorIndex]); // doesn't check old position new state -> possible collisions etc
		}
	}, []);
}

function nextTurn(phases: Array<Phase>, world: World, actors: Array<Actor>): Array<Actor> {
	return phases.reduce((someActors, aPhase) => {
		const proposals: Actor[]
			= aPhase.executePhase(someActors,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				someActors.map((anActor) => anActor.actions?.[aPhase.funcName]?.(someActors, anActor))
			);
			//someActors.forEach((anActor) => console.log(anActor.actions?.[aPhase.funcName]?.(someActors, anActor)));
		return resolveProposals(world, someActors, proposals);
	}, actors);
}

function displayGame(world: World, actors : Array<Actor>): void {
	console.log(actors.reduce((acc, actor) => actorToStringInWorld(world, acc, actor), worldToString(world)));
}

function playGame(display: (world: World, actors: Array<Actor>) => void): void {
	const world: World = initWorld(7, 7);
	let actors: Array<Actor> = initActors(world);
	const phases: Array<Phase> = initPhases();
	let finished: boolean = false;
	let i = 0;
	while (!finished) {
		actors = nextTurn(phases, world, actors);
		console.log(`turn : ${i}`);
		console.log('-'.repeat(world.width));
		display(world, actors);
		console.log(`${'-'.repeat(world.width)}\n`);
		finished = i++ === 5;
	}
}


export { playGame, initWorld, initPhases, initActors, nextTurn, displayGame };