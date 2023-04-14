import type { World } from "./world";
import { isPositionInWorld, createWorld } from "./world";
import { ActionReturnTypes, Phase } from "./phase";
import { Actor, createActor, translateActor, updateFaithPoints } from "./actor";
import { createPhase } from "./phase";
import { createVector } from "./geometry";
import { convertEnemiesPhase, enemyFleePhase, healPhase, spawnPhase, temperatureRisePhase } from "./game_phases";

/**
 * Initializes a new world to the given width and height where 0 turns
 * have elapsed.
 * @param width the width
 * @param height the height
 * @returns A brand new world where 0 turns have elapsed
 */
function initWorld(width: number, height: number): World {
	return createWorld(width, height, 0);
}

/**
 * 
 * @returns The array of phases
 */
function initPhases(): Array<Phase> {
	return [
		createPhase("spawn", spawnPhase),
		createPhase("temperatureRise", temperatureRisePhase),
		createPhase("convertEnemies", convertEnemiesPhase),
		createPhase("heal", healPhase),
		createPhase("enemyFlee", enemyFleePhase),
	];
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
		createActor(createVector(0, 1), {}, "entry", { wayPointNumber: 0 }),
		createActor(createVector(Math.floor((world.width - 1) / 3), Math.floor((world.height - 1) / 3)), {}, "ground", { wayPointNumber: 1 }),
		createActor(createVector(2 * Math.floor((world.width - 1) / 3), 2 * Math.floor((world.height - 1) / 3)), {}, "ground", { wayPointNumber: 2 }),
		createActor(createVector(world.width - 1, world.height - 1), {}, "exit", { wayPointNumber: 3 })
	];
}

function findEntries(actors: Array<Actor>): Array<Actor> {
	return actors.reduce((entries: Array<Actor>, currentActor: Actor) => currentActor.kind === "entry" ? entries.concat(currentActor) : entries, []);
}

//not pure
function getRandomArrayElement<T>(fromArray: Array<T>): T {
	if (fromArray.length === 0) {
		throw new Error('Cannot get a random element from an empty array');
	}
	return fromArray[Math.floor(Math.random() * fromArray.length)];
}

//not pure
function initOtherActors(entries: Array<Actor>): Array<Actor> {
	return [
		createActor(getRandomArrayElement(entries).position, { move: moveRight, heal: heal }, "ignorant", undefined, undefined, 0),
		createActor(getRandomArrayElement(entries).position, { move: moveRight, heal: heal }, "healer", undefined, undefined, 0)
	];
}

//not pure
function initActors(world: World): Array<Actor> {
	const path = initWayPoints(world);
	return path.concat(initOtherActors(findEntries(path)));
}

/**
 * Returns whether an actor is in a valid state or not
 * @param world The world
 * @param actor The actor
 * @returns true iif the actor is in the world's bounds
 */
function validNewActor(world: World, actor: Actor): boolean {
	return isPositionInWorld(world, actor.position);
}

/**
 * Ensures all actors are in a valid state and if they are not, resolves the conflict
 * @param world The world
 * @param actors The actors
 * @param proposals The new actors proposal
 * @returns An array of actor with no conflicts
 */
function resolveProposals(world: World, actors: Array<Actor>, proposals: Array<Actor>): Array<Actor> {
	return proposals.reduce((acc: Array<Actor>, currentProposal: Actor, actorIndex: number) => {
		if (validNewActor(world, currentProposal)) {
			return acc.concat(currentProposal);
		} else {
			return acc.concat(actors[actorIndex]); // doesn't check old position new state -> possible collisions etc
		}
	}, []);
}

/**
 * Computes the next turn of a world according to its phases and actors.
 * @param phases The phases
 * @param world The world
 * @param actors The actors
 * @returns A new array of actors
 */
function nextTurn(phases: Array<Phase>, world: World, actors: Array<Actor>): Array<Actor> {
	return phases.reduce((someActors, aPhase) => {
		const proposals: Actor[]
			= aPhase.executePhase(someActors,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				someActors.map((anActor) => anActor.actions?.[aPhase.funcName]?.(someActors, anActor))
			);
		return resolveProposals(world, someActors, proposals);
	}, actors);
}

/**
 * A function that plays the game and displays its state at every turn.
 * @param display The display function that displays a world and its actors
 */
function playGame(display: (world: World, actors: Array<Actor>) => void): void {
	const world: World = initWorld(7, 7);
	let actors: Array<Actor> = initActors(world);
	const phases: Array<Phase> = initPhases();
	let finished: boolean = false;
	let i = 0;
	console.log(`\n\x1b[32m PASTAFARIST \x1b[0m\n`);
	while (!finished) {
		console.log(`turn : \x1b[33m ${i} \x1b[0m`);
		display(world, actors);
		actors = nextTurn(phases, world, actors);
		finished = i++ === 5;
	}
	console.log(`turn : \x1b[33m ${i} \x1b[0m`);
	display(world, actors);
}


export { playGame, initWorld, initPhases, initActors, nextTurn };