import { Vector2D, vector2DToString } from "./geometry";
import { ActionReturnTypes } from "./phase";
import type { World } from "./world";

type ActorActions = {
	[Key in keyof ActionReturnTypes]: (world: World, actor: Actor) => ActionReturnTypes[Key];
};

type Kind = "ignorant" | "good_guy" | "ground";

type Actor = {
	pos: Vector2D;
	actions: ActorActions;
	tags? : string[];
	kind? : Kind;
	faith_point?: number;
};

function actorToString(a: Actor) {
	return `{pos: ${vector2DToString(a.pos)}${a.faith_point ? ', hp:' + a.faith_point : ''}}`;
}

function createActor(pos: Vector2D, actions: ActorActions) {
	return { pos: pos, actions: actions };
}

export { actorToString, createActor };
export type { Actor };