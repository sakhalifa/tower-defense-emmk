import type { Vector2D } from "./geometry";
import type { World } from "./world";
import type { ActorActions } from "./actor_actions";

import { vector2DToString, translatePoint, vectorHasCoords } from "./geometry";
import { isDeepStrictEqual, getRandomArrayElement } from "./util";
import { worldStringVectorToIndex, isPositionInWorld } from "./world";
import { stringReplaceAt } from "./util";
import { getWaypointTargetNumber, getWaypointTarget, setWaypointTargetNumber, setWaypointTarget } from "./props";

/**
 * Actors that can move by themselves on the board.
 */
const walkerKeys = ["ignorant", "ignoranceSpreader"] as const;
type Walker = typeof walkerKeys[number];

/**
 * All the different actor kinds.
 */
type Kind = Walker | "goodGuy" | "ground" | "spawner" | "spaghettiMonster" | "player";

/**
 * An actor. It has a position in the world, a kind, faithPoints points,
 * different actions describing its behavior during the differents Phases of the game,
 * and additional properties that are not typed.
 * Additional properties should always check kind and/or tag before actually accessing them.
 */
type Actor = {
	position: Vector2D;
	actions: ActorActions;
	kind: Kind;
	externalProps?: any;
	faithPoints?: number;
};

/**
 * Returns the string representation of the given actor
 * @param actor The actor that is described by the returned string
 * @returns the string representation of the actor
 */
function actorToString(actor: Actor): string {
	return `{position: ${vector2DToString(actor.position)}${actor.faithPoints !== undefined ? ', fp:' + actor.faithPoints : ''}}`;
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
 * @param kinds The kinds to keep
 * @returns A new array with actor from the given array, of the given kind
 */
function filterByKinds(actors: Array<Actor>, kinds : Array<Kind>): Array<Actor> {
	return actors.filter((actor) => kinds.find((key) => actor.kind === key));
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
	if (!possibilities.length) {
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
	if (walkerKeys.find((key) => movingActor.kind === key) && isDeepStrictEqual(newPosition, getWaypointTarget(movingActor))) {
		const nextWaypoint = findNextWaypointTarget(actors, getWaypointTarget(movingActor), getWaypointTargetNumber(movingActor));
		return setWaypointTargetNumber(
			setWaypointTarget({ ...movingActor, position: newPosition }, nextWaypoint.waypointTarget),
			nextWaypoint.waypointTargetNumber);
	}
	return { ...movingActor, position: newPosition };
}

/**
 * Returns whether an actor is valid among an environment (world, other actors...) given as parameters
 * @param world The world where the actor is
 * @param actor We want to know if this actor is valid
 * @returns true iif the actor is in the world's bounds
 */
function isValidActorInEnvironment(world: World, actor: Actor): boolean {
	return isPositionInWorld(world, actor.position);
}

/**
 * Returns the actors from the given actor array whose position respect the given position constraints
 * @param actors the actors potentially returned and againt which the coordinate constraints are tested
 * @param xPosition the x coordinate constraint. If undefined, x coordinate is not a constraint.
 * @param yPosition the y coordinate constraint. If undefined, x coordinate is not a constraint.
 * @returns the actors from the given actor array whose position respect the given position constraints
 */
function filterActorsByPosition(actors: Array<Actor>, xPosition?: number, yPosition?: number): Array<Actor> {
	return actors.filter((currentActor) => vectorHasCoords(currentActor.position, xPosition, yPosition));
}

export { actorToString, actorToStringInWorld, translateActor, translateAndUpdateWaypoint, 
	stringReplaceAt, filterByKinds, findNextWaypointTarget, isValidActorInEnvironment, walkerKeys,
	filterActorsByPosition };
export type { Actor, Kind, Walker };
