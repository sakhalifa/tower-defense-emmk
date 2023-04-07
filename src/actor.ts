import { Vector2D, vector2DToString } from "./geometry";
import { ActionReturnTypes } from "./phase";
import type { World } from "./world";

type ActorActions = {
	[Key in keyof ActionReturnTypes]: (world: World, actor: Actor) => ActionReturnTypes[Key];
};

//type Kind = "ignorant" | "good_guy" | "ground";	wip

type Actor = {
	pos: Vector2D;
	actions: ActorActions;
	//tags : string[];	wip
	//kind : Kind; 		wip
	hp?: number;
};

function actorToString(a: Actor) {
	return `{pos: ${vector2DToString(a.pos)}${a.hp ? ', hp:' + a.hp : ''}}`;
}

function createActor(pos: Vector2D, actions: ActorActions) {
	return { pos: pos, actions: actions };
}

export { actorToString, createActor };
export type { Actor };