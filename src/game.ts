import type { World } from "./world";
import type { Phase } from "./phase";
import type { Actor } from "./actor";
import type { Axis } from "./util";

import { isPositionInWorld, createWorld, randomPositionAlongAxis } from "./world";
import { createGround, createspaghettiMonster, createSpawner } from "./actor";
import { createPhase } from "./phase";
import { Vector2D } from "./geometry";
import { convertEnemiesPhase, enemyFleePhase, spreadIgnorancePhase, spawnPhase, temperatureRisePhase, movePhase } from "./game_phases";
import { isDeepStrictEqual } from "./util";

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

/**
 * Returns an array of 1 to maxPositions unique aligned positions
 * @param world the world on which the positions are computed
 * @param maxPositions the maximum number of positions inside the returned array
 * @param axis the returned positions can reach each other by a translation along this axis
 * @param lineNumber the coordinate of the returned position on the not-given axis
 * @returns an array of 1 to maxPositions unique positions, that all have the same coordinate value on the axis that was not given
 */
function createPositionsAlongAxis(world: World, maxPositions: number, axis: Axis, lineNumber: number): Array<Vector2D>{
	if (maxPositions < 1) {
		throw new Error("At least one position must be returned");
	}
	if ((axis === "x" && maxPositions > world.width) || (axis === "y" && maxPositions > world.height)) {
		throw new Error("It is impossible to return more than n unique positions along a line of n positions.");
	}
	function createPositionsAlongAxisTailRecursive(maxPositions: number, existingPositions: Array<Vector2D>): Array<Vector2D> {
		let newPosition: Vector2D;
		if (maxPositions === 1) {
			do {
				newPosition = randomPositionAlongAxis(world, axis, lineNumber);
			} while (existingPositions.find((currentPos) => isDeepStrictEqual(currentPos, newPosition)));
			return existingPositions.concat(newPosition);
		} else {
			if (Math.random() < 0.5) {
				do {
					newPosition = randomPositionAlongAxis(world, axis, lineNumber);
				} while (existingPositions.find((currentPos) => isDeepStrictEqual(currentPos, newPosition)));
				return createPositionsAlongAxisTailRecursive(maxPositions - 1, existingPositions.concat(newPosition));
			} else {
				return createPositionsAlongAxisTailRecursive(maxPositions - 1, existingPositions);
			}
		}
	}
	return createPositionsAlongAxisTailRecursive(maxPositions, []);
}

/**
 * Randomly initializes spawners
 * @param world the world where the spawners are created
 * @param maxSpawners the maximum number of returned spawners
 * @param spawnersAxis the returned spawners can reach each other by a translation along this axis
 * @param spawnerLineNumber the coordinate of the returned position on the not-given axis
 * @returns an array of 1 to maxSpawners spawners with unique positions, that all have the same coordinate value on the axis that was not given
 */
function initSpawners(world: World, maxSpawners: number, spawnersAxis : Axis, spawnerLineNumber: number): Array<Actor> {
	return createPositionsAlongAxis(world, maxSpawners, spawnersAxis, spawnerLineNumber).map((spawnerPosition) => createSpawner(spawnerPosition));
}

/**
 * Randomly initializes grounds
 * @param world the world where the grounds are created
 * @param maxGroundsPerLine the maximum number of created grounds per line along the groundsAxis
 * @param groundsAxis the returned grounds can reach each other by a translation along this axis
 * @param groundLineNumbers the coordinates of the returned positions on the not-given axis (for each line where ground are created)
 * @param numberOfGroundLines The number of lines of grounds (in groundsAxis direction) where grounds are created
 * @returns an array of numberOfGroundLines to maxGroundsPerLine * numberOfGroundLines grounds with unique positions
 */
function initGrounds(world: World, maxGroundsPerLine: number, groundsAxis : Axis, groundLineNumbers: Array<number>, numberOfGroundLines: number): Array<Actor> {
	return Array.from({ length: numberOfGroundLines },
		(_, index) => (createPositionsAlongAxis(world, maxGroundsPerLine, groundsAxis, groundLineNumbers[index])
		.map((groundPosition) => createGround(groundPosition, index + 1)))
		).flat();
}

/**
 * Randomly initializes spaghettiMonsters
 * @param world the world where the spaghettiMonsters are created
 * @param maxSpaghettiMonsters the maximum number of returned spaghettiMonsters
 * @param spaghettiMonstersAxis the returned spaghettiMonsters can reach each other by a translation along this axis
 * @param spaghettiMonstersLineNumber the coordinate of the returned position on the not-given axis
 * @param waypointNumber the waypointNumber of the spaghettiMonsters
 * @returns an array of 1 to maxSpaghettiMonsters spaghettiMonsters with unique positions, that all have the same coordinate value on the axis that was not given
 */
function initspaghettiMonster(world: World, maxSpaghettiMonsters: number, spaghettiMonstersAxis : Axis, spaghettiMonstersLineNumber: number, waypointNumber: number): Array<Actor> {
	return createPositionsAlongAxis(world, maxSpaghettiMonsters, spaghettiMonstersAxis, spaghettiMonstersLineNumber)
	.map((spaghettiMonsterPosition) => createspaghettiMonster(spaghettiMonsterPosition, waypointNumber));
}

/**
 * return evenly spaced lines numbers for the future creation of intermediate waypoints (ground)
 * @param intermediateWaypointsNumber the number of lines of intermediate waypoints
 * @param spaghettiMonsterLineNumber the line on which the spaghettiMonster is, this line should be the last reachable line
 * @param maxLineNumber the number of the last line on the axis where the lines of waypoints with same waypointNumber are
 * @returns evenly spaced lines numbers for the future creation of intermediate waypoints (ground)
 */
function computeIntermidiateWaypointsLineNumber(intermediateWaypointsNumber: number, spaghettiMonsterLineNumber: number, maxLineNumber: number): Array<number> {
	return Array.from({ length: intermediateWaypointsNumber },
		(_, index) => ((spaghettiMonsterLineNumber === 0) ? (intermediateWaypointsNumber - index) : (1 + index))
		* maxLineNumber / (intermediateWaypointsNumber + 1))
		.map((lineNumber) => Math.floor(lineNumber));
}

/**
 * Randomly creates the waypoints of the world (creates spawners, ground, and spaghettiMonster)
 * @param world the world on which the waypoints are created
 * @param intermediateWaypointsNumber the number of waypoints that have to be reached by the moving actors (spawner and spaghettiMonster not included)
 * @returns the created waypoints of the world
 */
function initWayPointActors(world: World, intermediateWaypointsNumber: number): Array<Actor> {
	const spawnersAxis: Axis = Math.random() < 0.5 ? "x" : "y";
	const maxLineNumber: number = spawnersAxis === "x" ? world.height - 1 : world.width - 1;
	const spawnerLineNumber: number = Math.random() < 0.5 ? 0 : maxLineNumber;
	const spaghettiMonsterLineNumber = maxLineNumber - spawnerLineNumber;
	const intermediateWaypointsLineNumber: Array<number> = computeIntermidiateWaypointsLineNumber(intermediateWaypointsNumber, spaghettiMonsterLineNumber, maxLineNumber);
	return initSpawners(world, 3, spawnersAxis, spawnerLineNumber)
	.concat(initGrounds(world, Math.random() < 0.7 ? 2 : 1, spawnersAxis, intermediateWaypointsLineNumber, intermediateWaypointsNumber))
	.concat(initspaghettiMonster(world, 1, spawnersAxis, spaghettiMonsterLineNumber, intermediateWaypointsNumber + 1));
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
	const world: World = initWorld(10, 10);
	let actors: Array<Actor> = initWayPointActors(world, 2);
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