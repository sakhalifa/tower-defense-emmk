import { Vector2D, vector2DToString, translatePoint } from "./geometry";
import { isDeepStrictEqual, getRandomArrayElement } from "./util";
import { ActionReturnTypes } from "./phase";
import { worldStringVectorToIndex } from "./world";
import { stringReplaceAt } from "./util";
import { defaultActions, heal, moveTowardNextWaypoint } from "./actor_actions";

import type { World } from "./world";
import type { ActorActions } from "./actor_actions";

/**
 * Actors that can move by themselves on the board.
 */
type Walker = "ignorant" | "healer";

/**
 * All the different actor kinds.
 */
type Kind = Walker | "goodGuy" | "ground" | "spawner" | "spaghettimonster";

/**
 * An actor. It has a position, a kind, faith points, different actions, tags and additional properties that are not typed.
 * Additional properties should always check kind and/or tag before actually accessing them.
 */
type Actor = {
	position: Vector2D;
	actions: ActorActions;
	kind: Kind;
	externalProps?: any;
	tags?: string[];
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
 * Returns the actors from the given actors that are of the given kind
 * @param actors The actors being filtered
 * @param kind The kind used to filter the actors
 * @returns the actors from the given actors that are of the given kind
 */
function findKind(actors: Array<Actor>, kind: Kind): Array<Actor> {
	return actors.reduce((entries: Array<Actor>, currentActor: Actor) => currentActor.kind === kind ? entries.concat(currentActor) : entries, []);
}

/**
 * Actor constructor
 * @param position The position
 * @param actions The actions
 * @param kind The kind
 * @param externalProps The external properties
 * @param tags The tags
 * @param ignorance The ignorance points
 * @returns A new actor
 */
function createActor(position: Vector2D, actions: ActorActions, kind: Kind, externalProps?: any, tags?: string[], ignorance: number = 10): Actor {
	return { position: position, actions: { ...defaultActions, ...actions }, tags: tags, kind: kind, ignorance: ignorance, externalProps: externalProps };
}

/**
 * Applies a translation to the actor's position and returns the translated actor.
 * @param actor The actor
 * @param movementVector The movement vector
 * @returns The actor after its position was translated according to a movement vector
 */
function translateActor(actor: Actor, movementVector: ActionReturnTypes["move"]): Actor {
	return { ...actor, position: translatePoint(actor.position, movementVector) };
}

//not pure
/**
 * 
 * @param actors 
 * @param currentWaypointTargetNumber 
 * @returns 
 */
function findNextWaypointTarget(actors: Array<Actor>, actor: Actor): [Vector2D, number] {
	const possibilities = actors.filter((currentActor) => currentActor?.externalProps?.waypointNumber === actor.externalProps.waypointTargetNumber + 1);
	if (possibilities.length === 0) {
		return actor.externalProps.waypointTarget;
	}
	const nextWaypointTarget = getRandomArrayElement(possibilities);
	return [nextWaypointTarget.position, nextWaypointTarget.externalProps.waypointNumber];
}

function updateNextWaypoint(actors: Array<Actor>, actor: Actor): Actor["externalProps"] {
	const [nextWaypointTarget, updatedWaypointTargetNumber] = findNextWaypointTarget(actors, actor);
	//const updatedWaypointTargetNumber = nextWaypointTarget !== actor.externalProps.waypointTarget ? actor.externalProps.waypointTargetNumber + 1;
	return { waypointTargetNumber: updatedWaypointTargetNumber, waypointTarget: nextWaypointTarget };
}

function translateTowardWaypoint(actors: Array<Actor>, actor: Actor, movementVector: ActionReturnTypes["move"]): Actor {
	const newPosition = translatePoint(actor.position, movementVector);
	if (isDeepStrictEqual(newPosition, actor?.externalProps?.waypointTarget)) {
		return { ...actor, position: newPosition,
			externalProps: updateNextWaypoint(actors, actor) };
	}
	return { ...actor, position: newPosition };
}

function createIgnorant(position: Vector2D, waypointTarget: Vector2D, tags?: string[]): Actor {
	return createActor(position, { move: moveTowardNextWaypoint }, "ignorant", { waypointTargetNumber: 1, waypointTarget: waypointTarget }, tags);
}

/**
 * Constructor for a default "healer" actor
 */
function createHealer(position: Vector2D, waypointTarget: Vector2D, tags?: string[]): Actor {
	return createActor(position, { move: moveTowardNextWaypoint, heal: heal }, "healer", { waypointTargetNumber: 1, waypointTarget: waypointTarget }, tags);
}

type WalkerCreator = {
	[key in Walker]: (position: Vector2D, waypointTarget: Vector2D, tags?: string[], ignorance?: number) => Actor
};

const walkerCreator: WalkerCreator = {
	ignorant: createIgnorant,
	healer: createHealer
};

function createWalker(kind: Walker, path: Array<Actor>, position: Vector2D, tags?: string[], ignorance?: number): Actor {
	const firstWaypoint = findNextWaypointTarget(path, 0);
	return walkerCreator[kind](position, firstWaypoint?.position ?? position, tags, ignorance);
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

export { actorToString, actorToStringInWorld, createActor, createGround, createSpaghettimonster, createSpawner, createHealer, createWalker, createIgnorant, translateActor, translateTowardWaypoint, findNextWaypointTarget as findNextWaypoint, stringReplaceAt, findKind, defaultActions };
export type { Actor, Kind };
