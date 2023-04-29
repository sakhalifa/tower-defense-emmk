import { Vector2D, vector2DToString, translatePoint } from "./geometry";
import { isDeepStrictEqual, getRandomArrayElement } from "./util";
import { worldStringVectorToIndex } from "./world";
import { stringReplaceAt } from "./util";
import { defaultActions, spreadIgnorance, moveTowardWaypointTarget, temperatureRise } from "./actor_actions";

import type { World } from "./world";
import type { ActorActions } from "./actor_actions";
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
 * An actor. It has a position, a kind, faith points, different actions, and additional properties that are not typed.
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
 * Returns the string representation of the actor
 * @param actor The actor
 * @returns the string representation of the actor
 */
function actorToString(actor: Actor): string {
	return `{position: ${vector2DToString(actor.position)}${actor.ignorance !== undefined ? ', fp:' + actor.ignorance : ''}}`;
}

/**
 * Returns the string representation of the world with its actors
 * @param world The world
 * @param worldString The world string
 * @param actor The actor
 * @returns The string representation of the world with its actors
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
 * @param position The position
 * @param actions The actions
 * @param kind The kind
 * @param externalProps The external properties
 * @param ignorance The ignorance points
 * @returns A new actor
 */
function createActor(position: Vector2D, actions: Partial<ActorActions>, kind: Kind, externalProps?: any, ignorance?: number): Actor {
	return { position: position, actions: { ...defaultActions, ...actions }, kind: kind, ignorance: ignorance, externalProps: externalProps };
}

/**
 * Applies a translation to the actor's position and returns the translated actor.
 * @param actor The actor
 * @param movementVector The movement vector
 * @returns The actor after its position was translated according to a movement vector
 */
function translateActor(actor: Actor, movementVector: ReturnType<ActorActions["move"]>): Actor {
	return { ...actor, position: translatePoint(actor.position, movementVector) };
}

//not pure
function findNextWaypointTarget(actors: Array<Actor>, waypointTarget: Vector2D, waypointTargetNumber: number): Actor["externalProps"] {
	const possibilities = actors.filter((currentActor) => currentActor?.externalProps?.waypointNumber === waypointTargetNumber + 1);
	if (possibilities.length === 0) {
		return { waypointTargetNumber: waypointTargetNumber, waypointTarget: waypointTarget };
	}
	const nextWaypointTarget = getRandomArrayElement(possibilities);
	return { waypointTargetNumber: nextWaypointTarget.externalProps.waypointNumber, waypointTarget: nextWaypointTarget.position };
}

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

function createIgnorant(position: Vector2D, waypointTarget: Vector2D, ignorance: number = 10): Actor {
	return createActor(position, { move: moveTowardWaypointTarget, temperatureRise: temperatureRise }, "ignorant", { waypointTargetNumber: 1, waypointTarget: waypointTarget }, ignorance);
}

/**
 * Constructor for a default "ignoranceSpreader" actor
 */
function createIgnoranceSpreader(position: Vector2D, waypointTarget: Vector2D, ignorance: number = 7): Actor {
	return createActor(position, { move: moveTowardWaypointTarget, spreadIgnorance: spreadIgnorance }, "ignoranceSpreader", { waypointTargetNumber: 1, waypointTarget: waypointTarget }, ignorance);
}

type WalkerCreator = {
	[key in Walker]: (position: Vector2D, waypointTarget: Vector2D, ignorance?: number) => Actor
};

const walkerCreator: WalkerCreator = {
	ignorant: createIgnorant,
	ignoranceSpreader: createIgnoranceSpreader
};

function createWalker(kind: Walker, path: Array<Actor>, position: Vector2D, ignorance?: number): Actor {
	const firstWaypoint = findNextWaypointTarget(path, position, 0);
	return walkerCreator[kind](position, firstWaypoint.waypointTarget, ignorance);
}

/**
 * Constructor for a default "spawner" actor
 */
function createSpawner(position: Vector2D): Actor {
	return createActor(position, {}, "spawner", { waypointNumber: 0 });
}

/**
 * Constructor for a default "ground" actor
 */
function createGround(position: Vector2D, waypointNumber: number): Actor {
	return createActor(position, {}, "ground", { waypointNumber: waypointNumber });
}

/**
 * Constructor for a default "spaghettimonster" actor
 */
function createSpaghettimonster(position: Vector2D, waypointNumber: number): Actor {
	return createActor(position, {}, "spaghettimonster", { waypointNumber: waypointNumber });
}

export { actorToString, actorToStringInWorld, createActor, createGround, createSpaghettimonster, createSpawner, createIgnoranceSpreader, createWalker, createIgnorant, translateActor, translateAndUpdateWaypoint, stringReplaceAt, filterByKind, defaultActions };
export type { Actor, Kind, Walker };
