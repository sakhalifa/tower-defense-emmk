import { Vector2D, createVector, vector2DToString, translatePoint } from "./geometry";
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

/**
 * All the default actions 
 */
const defaultActions: Required<ActorActions> = {
	spawn: (w, a) => undefined,
	temperatureRise: (w, a) => 0,
	heal: (w, a) => { return { actorIndices: [], amount: [] }; },
	convertEnemies: (w, a) => { return { actorIndices: [], amount: [] }; },
	enemyFlee: (w, a) => false,
	move: (w, a) => { return createVector(0, 0); }
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
	faithPoints?: number;
};

/**
 * Returns the string representation of the actor
 * @param actor The actor
 * @returns the string representation of the actor
 */
function actorToString(actor: Actor): string {
	return `{position: ${vector2DToString(actor.position)}${actor.faithPoints !== undefined ? ', fp:' + actor.faithPoints : ''}}`;
}

/**
 * Substitutes the i-th character of a string with another string.
 * @param baseString The string to replace the character
 * @param index The index to replace the character
 * @param replacement The replacement string
 * @returns The string with the replaced character
 */
function stringReplaceAt (baseString: string, index: number, replacement: string): string {
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

/**
 * Actor constructor
 * @param position The position
 * @param actions The actions
 * @param kind The kind
 * @param externalProps The external properties
 * @param tags The tags
 * @param faithPoints The faith points
 * @returns A new actor
 */
function createActor(position: Vector2D, actions: ActorActions, kind: Kind, externalProps?: any, tags?: string[], faithPoints?: number): Actor {
	return { position: position, actions: {...defaultActions, ...actions}, tags: tags, kind: kind, faithPoints: faithPoints, externalProps: externalProps };
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

function createIgnorant(position: Vector2D, actions: ActorActions, externalProps?: any, tags?: string[], faithPoints?: number): Actor{
	return createActor(position, actions, "ignorant", externalProps, tags, faithPoints);
}

/**
 * Constructor for a default "healer" actor
 */
function createHealer(position: Vector2D, actions: ActorActions, externalProps?: any, tags?: string[], faithPoints?: number): Actor{
	return createActor(position, actions, "healer", externalProps, tags, faithPoints);
}

/**
 * Constructor for a default "spawner" actor
 */
function createSpawner(position: Vector2D): Actor{
	return createActor(position, {}, "spawner", { wayPointNumber: 0 });
}

/**
 * Constructor for a default "ground" actor
 */
function createGround(position: Vector2D, wayPointNumber : number): Actor{
	return createActor(position, {}, "ground", { wayPointNumber: wayPointNumber });
}

/**
 * Constructor for a default "spaghettimonster" actor
 */
function createSpaghettimonster(position: Vector2D, wayPointNumber : number): Actor{
	return createActor(position, {}, "spaghettimonster", { wayPointNumber: wayPointNumber });
}

export { actorToString, actorToStringInWorld, createGround, createSpaghettimonster, createSpawner, createHealer, createIgnorant, translateActor, stringReplaceAt, defaultActions };
export type { Actor, Kind };
 