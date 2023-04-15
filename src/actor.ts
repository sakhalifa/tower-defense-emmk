import { Vector2D, createVector, vector2DToString, translatePoint } from "./geometry";
import { isDeepStrictEqual } from "util";
import { ActionReturnTypes } from "./phase";
import { worldStringVectorToIndex } from "./world";
import type { World } from "./world";
import { getRandomArrayElement } from "./util";

/**
 * All the possibles actions for an actor. It is mapped to {@link ActionReturnTypes} for consistency.
 */
type ActorActions = {
	[Key in keyof ActionReturnTypes]?: (actors: Array<Actor>, actor: Actor) => ActionReturnTypes[Key];
};

/**
 * All the different actor kinds.
 */
type Kind = "ignorant" | "goodGuy" | "ground" | "healer" | "spawner" | "spaghettimonster";

type Walker = "ignorant" | "healer"; // limit of functional programming, I would like to use inheritance to make sure Walker only contains elements from Kind

/**
 * All the default actions 
 */
const defaultActions: Required<ActorActions> = {
	spawn: (allActors, oneActor) => undefined,
	temperatureRise: (allActors, oneActor) => 0,
	heal: (allActors, oneActor) => { return { actorIndices: [], amount: [] }; },
	convertEnemies: (allActors, oneActor) => { return { actorIndices: [], amount: [] }; },
	enemyFlee: (allActors, oneActor) => false,
	move: (allActors, oneActor) => { return createVector(0, 0); }
};

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
 * Substitutes the i-th character of a string with another string.
 * @param baseString The string to replace the character
 * @param index The index to replace the character
 * @param replacement The replacement string
 * @returns The string with the replaced character
 */
function stringReplaceAt(baseString: string, index: number, replacement: string): string {
	return baseString.substring(0, index) + replacement + baseString.substring(index + replacement.length);
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
function createActor(position: Vector2D, actions: ActorActions, kind: Kind, externalProps?: any, tags?: string[], ignorance?: number): Actor {
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

function findNextWaypoint(actors: Array<Actor>, currentNextWaypointNumber: number): Actor | undefined {
	return actors.find((currentActor) => currentActor?.externalProps?.waypointNumber === currentNextWaypointNumber + 1);
}

function updateNextWaypoint(actors: Array<Actor>, currentNextWaypointNumber: number, currentNextWaypointPosition: Vector2D): Actor["externalProps"] {
	const nextWaypoint = findNextWaypoint(actors, currentNextWaypointNumber);
	if (nextWaypoint !== undefined) {
		return { nextWaypointNumber: nextWaypoint.externalProps.waypointNumber, nextWaypointPosition: nextWaypoint.externalProps.position };
	}
	return { nextWaypointNumber: currentNextWaypointNumber, nextWaypointPosition: currentNextWaypointPosition };
}

function translateTowardWaypoint(actors: Array<Actor>, actor: Actor, movementVector: ActionReturnTypes["move"]): Actor {
	const nextWaypoint = findNextWaypoint(actors, actor.externalProps.nextWaypointPosition)!;
	const newPosition = translatePoint(actor.position, movementVector);
	if (isDeepStrictEqual(actor?.externalProps?.nextWaypointPosition, newPosition)) {
		return { ...actor, position: newPosition, externalProps: { nextWaypointNumber: nextWaypoint.externalProps.waypointNumber, nextWaypointPosition: nextWaypoint.externalProps.position } };
	}
	if (actor.kind === "healer") {
		console.log("not on waypoint");
	}
	return { ...actor, position: newPosition };
}

function createIgnorant(position: Vector2D, actions: ActorActions, nextWaypointPosition: Vector2D, tags?: string[], ignorance?: number): Actor {
	return createActor(position, actions, "ignorant", { nextWaypointNumber: 1, nextWaypointPosition: nextWaypointPosition }, tags, ignorance);
}

/**
 * Constructor for a default "healer" actor
 */
function createHealer(position: Vector2D, actions: ActorActions, nextWaypointPosition: Vector2D, tags?: string[], ignorance?: number): Actor {
	return createActor(position, actions, "healer", { nextWaypointNumber: 1, nextWaypointPosition: nextWaypointPosition }, tags, ignorance);
}

type WalkerCreator = {
	[key in Walker]: (position: Vector2D, actions: ActorActions, nextWaypointPosition: Vector2D, tags?: string[], ignorance?: number) => Actor
};

const walkerCreator: WalkerCreator = {
	ignorant: createIgnorant,
	healer: createHealer
};

function createWalker(kind: Walker, path: Array<Actor>, position: Vector2D, actions: ActorActions, tags?: string[], ignorance?: number): Actor {
	const firstWaypoint = findNextWaypoint(path, 0);
	return walkerCreator[kind](position, actions, firstWaypoint?.position ?? position, tags, ignorance);
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

export { actorToString, actorToStringInWorld, createActor, createGround, createSpaghettimonster, createSpawner, createHealer, createWalker, createIgnorant, translateActor, translateTowardWaypoint, findNextWaypoint, stringReplaceAt, findKind, defaultActions };
export type { Actor, Kind };
