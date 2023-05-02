import type { Vector2D } from "./geometry";
import type { ActorActions } from "./actor_actions";
import type { Kind, Actor, Walker } from "./actor";

import { filterByKind, findNextWaypointTarget } from "./actor";
import { getRandomArrayElement } from "./util";
import { defaultActions, spreadIgnorance, moveTowardWaypointTarget, temperatureRise, spawn } from "./actor_actions";

/**
 * Actor constructor
 * @param position The position of the created Actor
 * @param actions The actions of the created Actor
 * @param kind The kind of the created Actor
 * @param externalProps The external properties of the created Actor
 * @param ignorance The ignorance points of the created Actor
 * @returns A new actor
 */
function createActor(position: Vector2D, actions: Partial<ActorActions>, kind: Kind, externalProps?: any, ignorance?: number): Actor {
	return { position: position, actions: { ...defaultActions, ...actions }, kind: kind, ignorance: ignorance, externalProps: externalProps };
}

/**
 * Constructor for a default "ignorant" actor
 * @param position the position where the ignorant is in the world
 * @param waypointTarget the next position that the ignorant has to reach
 * @param ignorance the level of ignorance of the ignorant
 * @returns the created Actor of kind "ignorant"
 */
function createIgnorant(position: Vector2D, waypointTarget: Vector2D, ignorance: number = 10): Actor {
	return createActor(position, { move: moveTowardWaypointTarget, temperatureRise: temperatureRise }, "ignorant", { waypointTargetNumber: 1, waypointTarget: waypointTarget }, ignorance);
}

/**
 * Constructor for a default "ignoranceSpreader" actor
 * @param position the position where the ignoranceSpreader is in the world
 * @param waypointTarget the next position that the ignoranceSpreader has to reach
 * @param ignorance the level of ignorance of the ignoranceSpreader
 * @returns the created Actor of kind "ignoranceSpreader"
 */
function createIgnoranceSpreader(position: Vector2D, waypointTarget: Vector2D, ignorance: number = 7): Actor {
	return createActor(position, { move: moveTowardWaypointTarget, spreadIgnorance: spreadIgnorance }, "ignoranceSpreader", { waypointTargetNumber: 1, waypointTarget: waypointTarget }, ignorance);
}

/**
 * Type that should be respected for creating a dictionnary containing the constructors of the Actors that can move by themselves during the move Phase.
 * see {@link walkerCreator}
 */
type WalkerCreator = {
	[key in Walker]: (position: Vector2D, waypointTarget: Vector2D, ignorance?: number) => Actor
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
 * @param ignorance the ignorance of the created Actor
 * @returns the created Actor whose kind is listed in the type {@link Walker}
 */
function createWalker(kind: Walker, path: Array<Actor>, ignorance?: number): Actor {
	const spawnPosition = getRandomArrayElement(filterByKind(path, "spawner")).position;
	const firstWaypoint = findNextWaypointTarget(path, spawnPosition, 0);
	return walkerCreator[kind](spawnPosition, firstWaypoint.waypointTarget, ignorance);
}

/**
 * Constructor for a default "spawner" actor
 * @param position the position where the spawner is in the world
 * @returns the created Actor of kind "spawner"
 */
function createSpawner(position: Vector2D): Actor {
	return createActor(position, {}, "spawner", { waypointNumber: 0 });
}

/**
 * Constructor for a default "ground" actor
 * @param waypointNumber the number indexing the order in which the waypoints have to be reached
 * @returns the created Actor of kind "ground"
 */
function createGround(position: Vector2D, waypointNumber: number): Actor {
	return createActor(position, {}, "ground", { waypointNumber: waypointNumber });
}

/**
 * Constructor for a default "spaghettiMonster" actor
 * @param waypointNumber the number indexing the order in which the waypoints have to be reached
 * @returns the created Actor of kind "spaghettiMonster"
 */
function createspaghettiMonster(position: Vector2D, waypointNumber: number): Actor {
	return createActor(position, {spawn: spawn}, "spaghettiMonster", { waypointNumber: waypointNumber });
}

export { createActor, createGround, createspaghettiMonster, createSpawner, createIgnoranceSpreader, createWalker, createIgnorant };