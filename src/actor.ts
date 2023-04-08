import { Vector2D, createVector, vector2DToString, translatePoint } from "./geometry";
import { ActionReturnTypes } from "./phase";
import type { World } from "./world";

type ActorActions = {
	[Key in keyof ActionReturnTypes]?: (world: World, actor: Actor) => ActionReturnTypes[Key];
};

type Kind = "ignorant" | "goodGuy" | "ground" | "healer";

const defaultActions: Required<ActorActions> = {
	temperatureRise: (w, a) => 0,
	heal: (w, a) => { return { actorIndices: [], amount: [] }; },
	convertEnemies: (w, a) => { return { actorIndices: [], amount: [] }; },
	enemyFlee: (w, a) => false,
	move: (w, a) => { return createVector(0, 0); }
};

type Actor = {
	pos: Vector2D;
	actions: ActorActions;
	kind: Kind;
	externalProps?: any;
	tags?: string[];
	faithPoints?: number;
};

function actorToString(a: Actor): string {
	return `{pos: ${vector2DToString(a.pos)}${a.faithPoints !== undefined ? ', fp:' + a.faithPoints : ''}}`;
}

function createActor(pos: Vector2D, actions: ActorActions, kind: Kind, externalProps?: any, tags?: string[], faithPoints?: number): Actor {
	return { pos: pos, actions: actions, tags: tags, kind: kind, faithPoints: faithPoints, externalProps: externalProps };
}

function translateActor(actor: Actor, movementVector: ActionReturnTypes["move"]) {
	return { ...actor, pos: translatePoint(actor.pos, movementVector) };
}

function updateFaithPoints(actor: Actor, actorIndex: number, healVectors: Array<ActionReturnTypes["heal"]>) {
	return {
		...actor,
		faithPoints: actor.faithPoints === undefined ? undefined :
			(
				healVectors.reduce((faithPointsAcc, healsVector) =>
					faithPointsAcc + (healsVector.amount?.[healsVector.actorIndices.indexOf(actorIndex)] ?? 0),
					actor.faithPoints)
			)
	};
}

export { actorToString, createActor, translateActor, updateFaithPoints, defaultActions };
export type { Actor, Kind };
