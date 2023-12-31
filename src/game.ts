import type { World } from "./world";
import type { Phase } from "./phase";
import { Actor, filterByKinds } from "./actor";
import type { Axis } from "./utils/other_utils";

import { positionsLinking } from "./utils/geometry";
import { createWorld, randomPositionsAlongAxis, createPositionsAlongAxis } from "./world";
import { createGround, createSpaghettiMonster, createSpawner, createPlayer } from "./actor_creators";
import { isValidActorInEnvironment, isWalker } from "./actor";
import { createPhase } from "./phase";
import { spreadConvictionPhase, enemyFleePhase, spawnPhase, temperatureRisePhase, movePhase, playPhase } from "./execute_phases";
import { otherAxis, isDeepStrictEqual } from "./utils/other_utils";
import { almostEvenlySpacedIntegers, randomUniqueIntegers } from "./utils/number_utils";
import { getFaithPoints } from "./props";

/**
 * Initializes a new world to the given width and height where 0 turns
 * have elapsed.
 * @param width the width
 * @param height the height
 * @returns A brand new world where 0 turns have elapsed
 */
function initWorld(width: number, height: number): World {
	return createWorld(width, height);
}

/**
 * @returns The array of phases
 */
function initPhases(): Array<Phase> {
	return [
		createPhase("spawn", spawnPhase),
		createPhase("temperatureRise", temperatureRisePhase),
		createPhase("convertEnemies", spreadConvictionPhase),
		createPhase("spreadIgnorance", spreadConvictionPhase),
		createPhase("move", movePhase),
		createPhase("play", playPhase),
		createPhase("enemyFlee", enemyFleePhase)
	];
}

/**
 * Randomly initializes spawners
 * @param world the world where the spawners are created
 * @param minSpawners the minimum number of returned spawners
 * @param maxSpawners the maximum number of returned spawners
 * @param spawnersParallelAxis the returned spawners can reach each other by a translation along this axis
 * @param spawnerLineNumber the coordinate of the returned position on the not-given axis
 * @param averageSpawnsPerPhase number representing the average of the sum of spawns during the spawn phase, for the returned spawners.
 * Note that this number is inferior to the actual number of returned spawners.
 * @returns an array of 1 to maxSpawners spawners with unique positions, that all have the same coordinate value on the axis that was not given
 * and that have the same probability of making someone spawn per spawn phase.
 */
function initSpawners(world: World, minSpawners: number, maxSpawners: number, spawnersParallelAxis : Axis, spawnerLineNumber: number, averageSpawnsPerPhase: number = 0.6): Array<Actor> {
	if (minSpawners < 1) {
		throw new Error("There should be at least one spawner in the game.");
	}
	const spawnersPerpendicularAxisCoord = randomUniqueIntegers(minSpawners, maxSpawners, 0, spawnersParallelAxis === "x" ? world.width : world.height);
	const spawnProba = averageSpawnsPerPhase / spawnersPerpendicularAxisCoord.length;
	return createPositionsAlongAxis(spawnersParallelAxis, spawnersPerpendicularAxisCoord, spawnerLineNumber).map((spawnerPosition) => createSpawner(spawnerPosition, spawnProba));
}

/**
 * Randomly initializes grounds
 * @param world the world where the grounds are created
 * @param minGroundsPerLine the minimum number of created grounds per line along the groundsAxis
 * @param maxGroundsPerLine the maximum number of created grounds per line along the groundsAxis
 * @param groundsAxis the returned grounds can reach each other by a translation along this axis
 * @param groundLineNumbers the coordinates of the returned positions on the not-given axis (for each line where ground are created)
 * @param numberOfGroundLines The number of lines of grounds (in groundsAxis direction) where grounds are created
 * @returns an array of numberOfGroundLines to maxGroundsPerLine * numberOfGroundLines grounds with unique positions
 */
function initGroundWaypoints(world: World, minGroundsPerLine: number, maxGroundsPerLine: number, groundsAxis : Axis, groundLineNumbers: Array<number>, numberOfGroundLines: number): Array<Array<Actor>> {
	return Array.from({ length: numberOfGroundLines },
		(_, index) => (randomPositionsAlongAxis(world, minGroundsPerLine, maxGroundsPerLine, groundsAxis, groundLineNumbers[index])
		.map((groundPosition) => createGround(groundPosition, index + 1)))
		);
}

/**
 * Randomly initializes spaghettiMonsters
 * @param world the world where the spaghettiMonsters are created
 * @param minSpaghettiMonsters the minimum number of returned spaghettiMonsters
 * @param maxSpaghettiMonsters the maximum number of returned spaghettiMonsters
 * @param spaghettiMonstersAxis the returned spaghettiMonsters can reach each other by a translation along this axis
 * @param spaghettiMonstersLineNumber the coordinate of the returned position on the not-given axis
 * @param waypointNumber the waypointNumber of the spaghettiMonsters
 * @returns an array of 1 to maxSpaghettiMonsters spaghettiMonsters with unique positions, that all have the same coordinate value on the axis that was not given
 */
function initspaghettiMonsters(world: World, minSpaghettiMonsters: number, maxSpaghettiMonsters: number, spaghettiMonstersAxis : Axis, spaghettiMonstersLineNumber: number, waypointNumber: number): Array<Actor> {
	return randomPositionsAlongAxis(world, minSpaghettiMonsters,  maxSpaghettiMonsters, spaghettiMonstersAxis, spaghettiMonstersLineNumber)
	.map((spaghettiMonsterPosition) => createSpaghettiMonster(spaghettiMonsterPosition, waypointNumber));
}

/**
 * Randomly creates the waypoints of the world (creates spawners, ground, and spaghettiMonster)
 * @param world the world on which the waypoints are created
 * @param intermediateWaypointsNumber the number of waypoints that have to be reached by the moving actors (spawner and spaghettiMonster not included)
 * @param averageSpawnsPerPhase number representing the average of the sum of spawns during the spawn phase, for the returned spawners.
 * Note that this number is inferior to the actual number of returned spawners.
 * @returns the created waypoints of the world
 */
function initWayPointActors(world: World, intermediateWaypointsNumber: number, spawnersAxis: Axis, averageSpawnsPerPhase?: number, minSpawners: number = 1, maxSpawners: number = 3): Array<Array<Actor>>{
	const maxLineNumber: number = spawnersAxis === "x" ? world.height - 1 : world.width - 1;
	const spawnerLineNumber: number = Math.random() < 0.5 ? 0 : maxLineNumber;
	const spaghettiMonsterLineNumber = maxLineNumber - spawnerLineNumber;
	const intermediateWaypointsLineNumber: Array<number> =
	almostEvenlySpacedIntegers(intermediateWaypointsNumber, spaghettiMonsterLineNumber ? 0 : maxLineNumber, spaghettiMonsterLineNumber);
	return [initSpawners(world, minSpawners,  maxSpawners, spawnersAxis, spawnerLineNumber, averageSpawnsPerPhase)]
	.concat(initGroundWaypoints(world, 1, Math.random() < 0.7 ? 2 : 1, spawnersAxis, intermediateWaypointsLineNumber, intermediateWaypointsNumber))
	.concat([initspaghettiMonsters(world, 1, 1, spawnersAxis, spaghettiMonsterLineNumber, intermediateWaypointsNumber + 1)]);
}

/**
 * Initializes the actors. Should be used at the beginning of the game
 * @param world the world where the actors are created
 * @param intermediateWaypointLinesNumber the number of waypoints that the actors need to cross between the spawners and the spaghettiMonsters
 * @param averageSpawnsPerPhase number representing the average of the sum of spawns during the spawn phase, for the returned spawners.
 * Note that this number is inferior to the actual number of returned spawners.
 * @returns the first actors of the game.
 */
function initActors(world: World, intermediateWaypointLinesNumber: number, spawnersAxis: Axis, averageSpawnsPerPhase?: number, playProba?: number, minSpawners?: number, maxSpawners?: number): Array<Actor> {
	const waypoints: Array<Array<Actor>> = initWayPointActors(world, intermediateWaypointLinesNumber, spawnersAxis, averageSpawnsPerPhase, minSpawners, maxSpawners);
	return waypoints.flat()
	.concat(positionsLinking(waypoints.map((waypointsSameValue) => waypointsSameValue.map((waypoint) => waypoint.position)), otherAxis(spawnersAxis))
	.map((position) => createGround(position))).concat(createPlayer(playProba));
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
		if (currentProposal === undefined) throw new Error("undefined actor");
		if (isValidActorInEnvironment(world, currentProposal)) {
			if(isWalker(currentProposal) &&
			!(filterByKinds(actors, ["ground", "spawner", "spaghettiMonster"])
			.find((currentGround) => isDeepStrictEqual(currentGround.position, currentProposal.position))
			)) {
				return acc;
			}
			return acc.concat(currentProposal);
		}
		return acc;
	}, []);
}

/**
 * Computes the next turn of a world according to its phases and actors.
 * @param phases The phases
 * @param world The world
 * @param actors The actors
 * @param spawnersAxis The axis that is parallel to the line that links the spawners
 * @returns A new array of actors
 */
function nextTurn(phases: Array<Phase>, world: World, actors: Array<Actor>, spawnersAxis: Axis): Array<Actor> {
	return phases.reduce((actorsAcc, aPhase) => {
		const proposals: Actor[]
			= aPhase.executePhase(actorsAcc,
				actorsAcc.map((actingActor) => actingActor.actions[aPhase.funcName]({actorsAcc, actingActor, world, spawnersAxis}) as any /* ReturnType<ActorActions[keyof ActorActions]> */)
			);
		return resolveProposals(world, actorsAcc, proposals);
	}, actors);
}

/**
 * A function that plays the game and displays its state at every turn.
 * @param display The display function that displays a world and its actors
 */
function playGame(display: (world: World, actors: Array<Actor>) => void): void {
	const world: World = initWorld(10, 10);
	const spawnersAxis: Axis = Math.random() < 0.5 ? "x" : "y";
	const playProba = 0.25;
	const spawnProba = 1;
	const intermediateWaypointLinesNumber = 2;
	let actors: Array<Actor> = initActors(world, intermediateWaypointLinesNumber, spawnersAxis, spawnProba, playProba);
	const phases: Array<Phase> = initPhases();
	console.log(`\n\x1b[32m PASTAFARIST \x1b[0m\n`);
	let turnCounter = 0; // in a purely functional way, an actor containing the turns combined with an incrementTurn action and an updateTurn phase could be made
	const maxTurn = 20;
	while (turnCounter < maxTurn && filterByKinds(actors, ["spaghettiMonster"]).some((spaghettiMonster) => getFaithPoints(spaghettiMonster) > 0)) {
		display(world, actors);
		actors = nextTurn(phases, world, actors, spawnersAxis);
		++turnCounter;
	}
	display(world, actors);

	if (filterByKinds(actors, ["spaghettiMonster"]).some((spaghettiMonster) => getFaithPoints(spaghettiMonster) > 0)) {
		console.log("Some spaghetti monsters still have faith, you won the game! :)");
	} else {
		console.log("Not a single spaghetti monsters still has faith, you lost the game! :(");
	}
}


export { playGame, initWorld, initPhases, initActors, initSpawners, nextTurn, initGroundWaypoints };