import type { Vector2D } from "./geometry";
import type { World } from "./world";
import type { ActorActions } from "./actor_actions";

import { vector2DToString, translatePoint } from "./geometry";
import { isDeepStrictEqual, getRandomArrayElement } from "./util";
import { worldStringVectorToIndex } from "./world";
import { stringReplaceAt } from "./util";
import { defaultActions, spreadIgnorance, moveTowardWaypointTarget, temperatureRise, spawn } from "./actor_actions";
import { getWaypointTargetNumber, getWaypointTarget, setWaypointTargetNumber, setWaypointTarget } from "./props";

/**
 * Actors that can move by themselves on the board.
 */
type Walker = "ignorant" | "ignoranceSpreader";

/**
 * All the different actor kinds.
 */
type Kind = Walker | "goodGuy" | "ground" | "spawner" | "spaghettimonster";

/**
 * An actor. It has a position in the world, a kind, ignorance points,
 * different actions describing its behavior during the differents Phases of the game,
 * and additional properties that are not typed.
 * Additional properties should always check kind and/or tag before actually accessing them.
 */
type Actor = {
	position: Vector2D;
	actions: ActorActions;
	kind: Kind;
	externalProps?: any;
	ignorance?: number;
};

/**
 * Returns the string representation of the given actor
 * @param actor The actor that is described by the returned string
 * @returns the string representation of the actor
 */
function actorToString(actor: Actor): string {
	return `{position: ${vector2DToString(actor.position)}${actor.ignorance !== undefined ? ', fp:' + actor.ignorance : ''}}`;
}

/**
 * Returns the string representation of the world with the given actor in it
 * @param world The world represented by worldString, and where the actors are
 * @param worldString The string that represents the world, but not necessarily representing all of the actors in the world
 * @param actor The actor that is being added to the string representation of the world
 * @returns The string representation of the world with the given actor in it
 */
function actorToStringInWorld(world: World, worldString: string, actor: Actor): string {
	return stringReplaceAt(worldString, worldStringVectorToIndex(world, actor.position), actor.kind.charAt(0));
}

/**
 * Return a new array containing actors with the specified kind.
 * 
 * @param actors The array to filter from 
 * @param kind The kind to keep
 * @returns A new array with actor from the given array, of the given kind
 */
function filterByKind(actors: Array<Actor>, kind : Kind): Array<Actor> {
	return actors.filter((actor) => actor.kind === kind);
}

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
 * Applies a translation to the actor's position and returns the translated actor.
 * @param actor The actor that is being tranlated
 * @param movementVector The movement vector
 * @returns The actor after its position was translated according to a movement vector
 */
function translateActor(actor: Actor, movementVector: ReturnType<ActorActions["move"]>): Actor {
	return { ...actor, position: translatePoint(actor.position, movementVector) };
}

/**
 * Returns the informations about the waypoint that should be the target once the given waypoint is reached
 * @param actors all the actors of the game
 * @param waypointTarget the position of the current waypoint target
 * @param waypointTargetNumber the number of the current waypoint target
 * @returns a dictionnary containing the informations about the waypoint that should be the target once the given waypoint is reached
 */
function findNextWaypointTarget(actors: Array<Actor>, waypointTarget: Vector2D, waypointTargetNumber: number): Actor["externalProps"] {
	const possibilities = actors.filter((currentActor) => currentActor?.externalProps?.waypointNumber === waypointTargetNumber + 1);
	if (possibilities.length === 0) {
		return { waypointTargetNumber: waypointTargetNumber, waypointTarget: waypointTarget };
	}
	const nextWaypointTarget = getRandomArrayElement(possibilities);
	return { waypointTargetNumber: nextWaypointTarget.externalProps.waypointNumber, waypointTarget: nextWaypointTarget.position };
}

/**
 * Translates the movingActor according to the given movementVector, and updates its waypointTarget if it has been reached
 * @param actors all the actors of the game
 * @param movingActor the actor that is being translated
 * @param movementVector the movement defining where the movingActor is moving
 * @returns the movingActor with its updated position (after the movement)
 */ 
function translateAndUpdateWaypoint(actors: Array<Actor>, movingActor: Actor, movementVector: ReturnType<ActorActions["move"]>): Actor {
	const newPosition = translatePoint(movingActor.position, movementVector);
	if (isDeepStrictEqual(newPosition, getWaypointTarget(movingActor))) {
		const nextWaypoint = findNextWaypointTarget(actors, getWaypointTarget(movingActor), getWaypointTargetNumber(movingActor));
		return setWaypointTargetNumber(
			setWaypointTarget({ ...movingActor, position: newPosition }, nextWaypoint.waypointTarget),
			nextWaypoint.waypointTargetNumber);
	}
	return { ...movingActor, position: newPosition };
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
 * Constructor for a default "spaghettimonster" actor
 * @param waypointNumber the number indexing the order in which the waypoints have to be reached
 * @returns the created Actor of kind "spaghettimonster"
 */
function createSpaghettimonster(position: Vector2D, waypointNumber: number): Actor {
	return createActor(position, {spawn: spawn}, "spaghettimonster", { waypointNumber: waypointNumber });
}

export { actorToString, actorToStringInWorld, createActor, createGround, createSpaghettimonster, createSpawner, createIgnoranceSpreader, createWalker, createIgnorant, translateActor, translateAndUpdateWaypoint, stringReplaceAt, filterByKind };
export type { Actor, Kind, Walker };
