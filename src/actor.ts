import { Vector2D, vector2DToString } from "./geometry";
import { ActionReturnTypes, Phase } from "./phase";
import type { World } from "./world";

type ActorActions = {
	[key in keyof ActionReturnTypes]: (world: World, actor: Actor) => ActionReturnTypes[key];
};

type Actor = {
	pos: Vector2D;
	actions: ActorActions;
};

function actorToString(a: Actor) {
	return `{pos: ${vector2DToString(a.pos)}}`;
}

function createActor(pos: Vector2D, actions: ActorActions) {
	return;
}
function moveActor(a: Actor, dx: number, dy: number) {

}

export { actorToString };
export type { Actor };