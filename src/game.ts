import type { World } from "./world";
import type { Phase } from "./phase";
import type { Actor } from "./actor";
import type { Axis } from "./util";
import type { Vector2D } from "./geometry";

import { createWorld, randomPositionAlongAxis } from "./world";
import { createGround, createspaghettiMonster, createSpawner } from "./actor_creators";
import { isValidActorInEnvironment } from "./actor";
import { createPhase } from "./phase";
import { convertEnemiesPhase, enemyFleePhase, spreadIgnorancePhase, spawnPhase, temperatureRisePhase, movePhase } from "./game_phases";
import { almostEvenlySpacedIntegers } from "./util";
import { linkingPath } from "./geometry";

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
 * Randomly initializes spawners
 * @param world the world where the spawners are created
 * @param maxSpawners the maximum number of returned spawners
 * @param spawnersAxis the returned spawners can reach each other by a translation along this axis
 * @param spawnerLineNumber the coordinate of the returned position on the not-given axis
 * @returns an array of 1 to maxSpawners spawners with unique positions, that all have the same coordinate value on the axis that was not given
 */
function initSpawners(world: World, maxSpawners: number, spawnersAxis : Axis, spawnerLineNumber: number): Array<Actor> {
	return randomPositionAlongAxis(world, maxSpawners, spawnersAxis, spawnerLineNumber).map((spawnerPosition) => createSpawner(spawnerPosition));
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
function initGroundWaypoints(world: World, maxGroundsPerLine: number, groundsAxis : Axis, groundLineNumbers: Array<number>, numberOfGroundLines: number): Array<Array<Actor>> {
	return Array.from({ length: numberOfGroundLines },
		(_, index) => (randomPositionAlongAxis(world, maxGroundsPerLine, groundsAxis, groundLineNumbers[index])
		.map((groundPosition) => createGround(groundPosition, index + 1)))
		);
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
	return randomPositionAlongAxis(world, maxSpaghettiMonsters, spaghettiMonstersAxis, spaghettiMonstersLineNumber)
	.map((spaghettiMonsterPosition) => createspaghettiMonster(spaghettiMonsterPosition, waypointNumber));
}

/**
 * Randomly creates the waypoints of the world (creates spawners, ground, and spaghettiMonster)
 * @param world the world on which the waypoints are created
 * @param intermediateWaypointsNumber the number of waypoints that have to be reached by the moving actors (spawner and spaghettiMonster not included)
 * @returns the created waypoints of the world
 */
function initWayPointActors(world: World, intermediateWaypointsNumber: number): Array<Array<Actor>> {
	const spawnersAxis: Axis = Math.random() < 0.5 ? "x" : "y";
	const maxLineNumber: number = spawnersAxis === "x" ? world.height - 1 : world.width - 1;
	const spawnerLineNumber: number = Math.random() < 0.5 ? 0 : maxLineNumber;
	const spaghettiMonsterLineNumber = maxLineNumber - spawnerLineNumber;
	const intermediateWaypointsLineNumber: Array<number> =
	almostEvenlySpacedIntegers(intermediateWaypointsNumber, spaghettiMonsterLineNumber ? 0 : maxLineNumber, spaghettiMonsterLineNumber);
	return [initSpawners(world, 3, spawnersAxis, spawnerLineNumber)]
	.concat(initGroundWaypoints(world, Math.random() < 0.7 ? 2 : 1, spawnersAxis, intermediateWaypointsLineNumber, intermediateWaypointsNumber))
	.concat([initspaghettiMonster(world, 1, spawnersAxis, spaghettiMonsterLineNumber, intermediateWaypointsNumber + 1)]);
}

function initActors(world: World, intermediateWaypointsNumber: number): Array<Actor> {
	const waypoints = initWayPointActors(world, intermediateWaypointsNumber);
	return waypoints.flat()
	.concat(positionsLinking(waypoints.map((waypointsSameValue) => waypointsSameValue.map((waypoint) => waypoint.position)))
	.map((position) => createGround(position)));
}

function positionsLinking(positions: Array<Array<Vector2D>>): Array<Vector2D> {
	return positions.reduce((acc: Array<Vector2D>, currentPositions, index) => {
		if (!index) {
			return acc;
		}
		return acc.concat(currentPositions.map((currentPosition) => positions[index - 1]
		.map((previousPosition) => linkingPath(previousPosition, currentPosition)).flat()).flat());
	}, []);
}

/**
 * Ensures all proposed actors are in a valid state and if they are not, resolves the conflict
 * @param world The world where the actors are
 * @param actors The state of the actors before the proposal of their new state was made
 * @param proposals We want to know if these actors are valid
 * @returns An array of actor with valid states and no conflicts
 */
function resolveProposals(world: World, actors: Array<Actor>, proposals: Array<Actor>): Array<Actor> {
	return proposals.reduce((acc: Array<Actor>, currentProposal: Actor, actorIndex: number) => {
		if (isValidActorInEnvironment(world, currentProposal)) {
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
	let actors: Array<Actor> = initActors(world, 2);
	const phases: Array<Phase> = initPhases();
	let i = 0;
	console.log(`\n\x1b[32m PASTAFARIST \x1b[0m\n`);
	while (i < 10) {
		console.log(`turn : \x1b[33m ${i} \x1b[0m`);
		display(world, actors);
		actors = nextTurn(phases, world, actors);
		++i;
	}
	console.log(`turn : \x1b[33m ${i} \x1b[0m`);
	display(world, actors);
}


export { playGame, initWorld, initPhases, initActors, nextTurn };