import type { Actor } from "./actor";
import { Vector2D } from "./geometry";

import { actorToString } from "./actor";


type World = {
	width: number;
	height: number;
};

function createWorld(width: number, height: number) {
	return {
		width: width,
		height: height
	};
}

function isPositionInWorld(world: World, position: Vector2D): boolean {
	return position.x >= 0 && position.x < world.width && position.y >= 0 && position.y < world.height;
}

function worldToString(world: World) {
	//return `{
	//	width: ${w.width}
	//	height: ${w.height}
	//	actors: [
	//		${w.actors.map((actor) => actorToString(actor)).join(", ")}
	//	]
	//}`;
	//return `actors: [ ${w.actors.map((actor) => actorToString(actor)).join(", ")} ]`;
	return `${' '.repeat(world.width)}\n`.repeat(world.height);
}

export {
	createWorld, worldToString, isPositionInWorld
};

export type {
	World
};
