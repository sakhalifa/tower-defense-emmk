import type { World } from "./world";
import type { Phase } from "./phase";
import type { Actor } from "./actor";

import { isPositionInWorld, createWorld, randomPositionOnEdge } from "./world";
import { createGround, createSpaghettimonster, createSpawner } from "./actor";
import { createPhase } from "./phase";
import { Vector2D, createVector } from "./geometry";
import { convertEnemiesPhase, enemyFleePhase, spreadIgnorancePhase, spawnPhase, temperatureRisePhase, movePhase } from "./game_phases";
import { Direction, randomDirection, oppositeDirection } from "./directions";
import { isDeepStrictEqual } from "util";

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
		createPhase("move", movePhase),
		createPhase("spreadIgnorance", spreadIgnorancePhase),
		createPhase("enemyFlee", enemyFleePhase),
	];
}

function createSpawnerPositions(world: World, max_spawners: number, spawnerEdge: Direction): Array<Actor>{
	if (max_spawners < 1 || max_spawners > world.height || max_spawners > world.width) {
		throw new Error("invalid spawner number");
	}
	function createSpawnerPositionsTailRecursive(max_spawners: number, existingSpawners: Array<Vector2D>): Array<Vector2D> {
		let newSpawnerPosition: Vector2D;
		if (max_spawners === 1) {
			do {
				newSpawnerPosition = randomPositionOnEdge(world, spawnerEdge);
			} while (existingSpawners.find((currentPos) => isDeepStrictEqual(currentPos, newSpawnerPosition)));
			return existingSpawners.concat(newSpawnerPosition);
		} else {
			if (Math.random() < 0.5) {
				do {
					newSpawnerPosition = randomPositionOnEdge(world, spawnerEdge);
				} while (existingSpawners.find((currentPos) => isDeepStrictEqual(currentPos, newSpawnerPosition)));
				return createSpawnerPositionsTailRecursive(max_spawners - 1, existingSpawners.concat(newSpawnerPosition));
			} else {
				return createSpawnerPositionsTailRecursive(max_spawners - 1, existingSpawners);
			}
		}
	}
	return createSpawnerPositionsTailRecursive(max_spawners, []).map((spawnerPosition) => createSpawner(spawnerPosition));
}

/**
 * Randomly creates the waypoints of the world (creates spawners, ground, and spaghettimonster)
 * @param world the world on which the waypoints are created
 * @returns the created waypoints of the world
 */
function initWayPointActors(world: World): Array<Actor> {
	const spawnerEdge: Direction = randomDirection();
	//let spawnerPositions: Array<Vector2D> = [randomPositionOnEdge(world, spawnerEdge)];
	//if (Math.random() < 0.5) {
	//	let newSpawnerPosition: Vector2D;
	//	do {
	//		newSpawnerPosition = randomPositionOnEdge(world, spawnerEdge);
	//	} while (spawnerPositions.find((currentPos) => isDeepStrictEqual(currentPos, newSpawnerPosition)));
	//	spawnerPositions = spawnerPositions.concat(newSpawnerPosition);
	//}

	return createSpawnerPositions(world, 3, Direction.west).concat([
		createGround(createVector(Math.floor((world.width - 1) / 3), Math.floor((world.height - 1) / 3)), 1),
		createGround(createVector(2 * Math.floor((world.width - 1) / 3), 2 * Math.floor((world.height - 1) / 3)), 2),
		createSpaghettimonster(createVector(world.width - 1, world.height - 1), 3)
	]);
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
				someActors.map((anActor) => anActor.actions[aPhase.funcName](someActors, anActor) as any /* ReturnType<ActorActions[keyof ActorActions]> */)
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
	let actors: Array<Actor> = initWayPointActors(world);
	const phases: Array<Phase> = initPhases();
	let finished: boolean = false;
	let i = 0;
	console.log(`\n\x1b[32m PASTAFARIST \x1b[0m\n`);
	while (!finished) {
		console.log(`turn : \x1b[33m ${i} \x1b[0m`);
		display(world, actors);
		actors = nextTurn(phases, world, actors);
		finished = i++ === 10;
	}
	console.log(`turn : \x1b[33m ${i} \x1b[0m`);
	display(world, actors);
}


export { playGame, initWorld, initPhases, initWayPointActors, nextTurn };