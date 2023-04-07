import { Vector2D, createVector, vector2DToString } from "./geometry";
import { ActionReturnTypes } from "./phase";
import type { World } from "./world";

type ActorActions = {
	[Key in keyof ActionReturnTypes]?: (world: World, actor: Actor) => ActionReturnTypes[Key];
};

type Kind = "ignorant" | "good_guy" | "ground" | "healer";

const defaultActions: Required<ActorActions> = {
	temperatureRise: (w, a) => 0,
	heal: (w, a) => { return { actorIds: [], amount: [] }; },
	convertEnemies: (w, a) => { return { actorIds: [], amount: [] }; },
	enemyFlee: (w, a) => false,
	move: (w, a) => { return createVector(0, 0); }
};

type Actor = {
	pos: Vector2D;
	actions: ActorActions;
	tags?: string[];
	kind: Kind;
	faith_point?: number;
	externalProps: any;
};

function actorToString(a: Actor) {
	return `{pos: ${vector2DToString(a.pos)}${a.faith_point !== undefined ? ', fp:' + a.faith_point : ''}}`;
}

function createActor(pos: Vector2D, actions: ActorActions, externalProps: any, tags?: string[], kind?: Kind, faith_point?: number) {
	return { pos: pos, actions: actions, tags: tags, kind: kind, faith_point: faith_point , externalProps: externalProps};
}

export { actorToString, createActor, defaultActions };
export type { Actor };