import { Vector2D, createVector } from "./geometry";
import { ActorActions, enemyFlee } from "./actor_actions";
import type { Kind, Actor, Walker } from "./actor";

import { filterByKinds, findNextWaypointTarget } from "./actor";
import { getRandomArrayElement } from "./util";
import { defaultActions, spreadIgnorance, moveTowardWaypointTarget, temperatureRise, spawn, play } from "./actor_actions";
import { setSpawnProba, setWaypointNumber, setWaypointTarget, setWaypointTargetNumber } from "./props";

/**
 * Actor constructor
 * @param position The position of the created Actor
 * @param actions The actions of the created Actor
 * @param kind The kind of the created Actor
 * @param externalProps The external properties of the created Actor
 * @param faithPoints The faithPoints points of the created Actor
 * @returns A new actor
 */
function createActor(position: Vector2D, actions: Partial<ActorActions>, kind: Kind, faithPoints?: number): Actor {
	return { position, actions: { ...defaultActions, ...actions }, kind, faithPoints };
}

function setWaypointTargetAndNumber(actor: Actor, waypointTarget: Vector2D, waypointTargetNumber: number) {
	return setWaypointTarget(
		setWaypointTargetNumber(actor, waypointTargetNumber), waypointTarget
	);
}

/**
 * Constructor for a default "ignorant" actor
 * @param position the position where the ignorant is in the world
 * @param waypointTarget the next position that the ignorant has to reach
 * @param faithPoints the level of faithPoints of the ignorant
 * @returns the created Actor of kind "ignorant"
 */
function createIgnorant(position: Vector2D, waypointTarget: Vector2D, faithPoints: number = 10): Actor {
	//{ waypointTargetNumber: 1, waypointTarget: waypointTarget }
	return setWaypointTargetAndNumber(
		createActor(position, { move: moveTowardWaypointTarget, temperatureRise: temperatureRise, enemyFlee: enemyFlee }, "ignorant", faithPoints),
		waypointTarget,
		1);
}

/**
 * Constructor for a default "ignoranceSpreader" actor
 * @param position the position where the ignoranceSpreader is in the world
 * @param waypointTarget the next position that the ignoranceSpreader has to reach
 * @param faithPoints the level of faithPoints of the ignoranceSpreader
 * @returns the created Actor of kind "ignoranceSpreader"
 */
function createIgnoranceSpreader(position: Vector2D, waypointTarget: Vector2D, faithPoints: number = 7): Actor {
	//
	return setWaypointTargetAndNumber(
		createActor(position, { move: moveTowardWaypointTarget, spreadIgnorance: spreadIgnorance, enemyFlee: enemyFlee }, "ignoranceSpreader", faithPoints),
		waypointTarget,
		1);
}

/**
 * Type that should be respected for creating a dictionnary containing the constructors of the Actors that can move by themselves during the move Phase.
 * see {@link walkerCreator}
 */
type WalkerCreator = {
	[key in Walker]: (position: Vector2D, waypointTarget: Vector2D, faithPoints?: number) => Actor
};

/**
 * Constructors for the Actors that can move by themselves during the move Phase.
 * The elements of the dictionnary are constrained by the type {@link WalkerCreator}
 */
const walkerCreator: WalkerCreator = {
	ignorant: createIgnorant,
	ignoranceSpreader: createIgnoranceSpreader
};

/**
 * Generic fonction called to create Actors that can move by themselves during the move Phase.
 * Those Actors are listed in the type {@link Walker}.
 * @param kind the kind of the created Actor
 * @param path the waypoints constraining the path on which the Actor will move
 * @param position the position of the created Actor
 * @param faithPoints the faithPoints of the created Actor
 * @returns the created Actor whose kind is listed in the type {@link Walker}
 */
function createWalker(kind: Walker, path: Array<Actor>, position: Vector2D, faithPoints?: number): Actor {
	const firstWaypoint = findNextWaypointTarget(path, position, 0);
	return walkerCreator[kind](position, firstWaypoint.waypointTarget, faithPoints);
}

/**
 * Constructor for a default "spawner" actor
 * @param position the position where the spawner is in the world
 * @param spawnProba number in [0, 1] representing the probability during each spawn phase to create a new Actor
 * @returns the created Actor of kind "spawner"
 */
function createSpawner(position: Vector2D, spawnProba: number = 0.3): Actor {
	//{ waypointNumber: 0, spawnProba: spawnProba }
	return setSpawnProba(
		setWaypointNumber(createActor(position, { spawn: spawn }, "spawner"), 0),
		spawnProba);
}

/**
 * Constructor for a default "ground" actor
 * @param waypointNumber the number indexing the order in which the waypoints have to be reached
 * @returns the created Actor of kind "ground"
 */
function createGround(position: Vector2D, waypointNumber?: number): Actor {
	return waypointNumber ? setWaypointNumber(createActor(position, {}, "ground"), waypointNumber) : createActor(position, {}, "ground");
}

function createGoodGuy(position: Vector2D): Actor {
	return createActor(position, {}, "goodGuy");
}

/**
 * Constructor for a default "spaghettiMonster" actor
 * @param waypointNumber the number indexing the order in which the waypoints have to be reached
 * @returns the created Actor of kind "spaghettiMonster"
 */
function createspaghettiMonster(position: Vector2D, waypointNumber: number, faithPoints: number = 50): Actor {
	return setWaypointNumber(createActor(position, {}, "spaghettiMonster", faithPoints), waypointNumber);
}

function createPlayer(): Actor {
	return createActor(createVector(0, 0), { play: play }, "player");
}

export { createActor, createGround, createspaghettiMonster, createSpawner, createIgnoranceSpreader, createWalker, createIgnorant, createPlayer, createGoodGuy };