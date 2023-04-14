import { Vector2D, createVector, vector2DToString, translatePoint } from "./geometry";
import { ActionReturnTypes } from "./phase";
import { worldStringVectorToIndex } from "./world";
import type { World } from "./world";


type ActorActions = {
	[Key in keyof ActionReturnTypes]?: (actors: Array<Actor>, actor: Actor) => ActionReturnTypes[Key];
};

type Kind = "ignorant" | "goodGuy" | "ground" | "healer" | "spawner" | "boss";

const defaultActions: Required<ActorActions> = {
	spawn: (w, a) => undefined,
	temperatureRise: (w, a) => 0,
	heal: (w, a) => { return { actorIndices: [], amount: [] }; },
	convertEnemies: (w, a) => { return { actorIndices: [], amount: [] }; },
	enemyFlee: (w, a) => false,
	move: (w, a) => { return createVector(0, 0); }
};

type Actor = {
	position: Vector2D;
	actions: ActorActions;
	kind: Kind;
	externalProps?: any;
	tags?: string[];
	faithPoints?: number;
};

function actorToString(actor: Actor): string {
	return `{position: ${vector2DToString(actor.position)}${actor.faithPoints !== undefined ? ', fp:' + actor.faithPoints : ''}}`;
}

function stringReplaceAt (baseString: string, index: number, replacement: string): string {
    return baseString.substring(0, index) + replacement + baseString.substring(index + replacement.length);
}

function actorToStringInWorld(world: World, worldString: string, actor: Actor): string {
	return stringReplaceAt(worldString, worldStringVectorToIndex(world, actor.position), actor.kind.charAt(0));
}

function createActor(position: Vector2D, actions: ActorActions, kind: Kind, externalProps?: any, tags?: string[], faithPoints?: number): Actor {
	return { position: position, actions: {...defaultActions, ...actions}, tags: tags, kind: kind, faithPoints: faithPoints, externalProps: externalProps };
}

function translateActor(actor: Actor, movementVector?: ActionReturnTypes["move"]): Actor {
	return { ...actor, position: movementVector === undefined ? actor.position : translatePoint(actor.position, movementVector) };
}

function updateFaithPoints(actor: Actor, actorIndex: number, healVectors?: Array<ActionReturnTypes["heal"]>): Actor {
	return {
		...actor,
		faithPoints: actor.faithPoints === undefined ? undefined :
			(
				healVectors === undefined ? actor.faithPoints :
					(
						healVectors.reduce((faithPointsAcc, healsVector) =>
							faithPointsAcc + (healsVector?.amount?.[healsVector.actorIndices.indexOf(actorIndex)] ?? 0),
							actor.faithPoints)
					)

			)
	};
}

function createIgnorant(): Actor{
	throw Error();
}

function createHealer(): Actor{
	throw Error();
}

export { actorToString, actorToStringInWorld, createActor, createHealer, createIgnorant, translateActor, updateFaithPoints, defaultActions };
export type { Actor, Kind };
