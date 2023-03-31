import type { Actor } from "./actor";
import type { Matrix, Vector2D } from "./geometry";

import { actorToString } from "./actor";


type World = {
	actors: Array<Actor>;
	width: number;
	height: number;
};

function createWorld(width: number, height: number, actors: Array<Actor>) {
	return {
		actors: actors,
		width: width,
		height: height
	};
}

function isPositionInWorld(world: World, position: Vector2D): boolean {
	return position.x >= 0 && position.x < world.width && position.y >= 0 && position.y < world.height;
}

function worldToString(w: World) {
	// TODO
	return `{
		width: ${w.width}
		height: ${w.height}
		actors:
		}
	}`; //${matrixToString(w.actors, actorToString)
}

export {
	createWorld, worldToString, isPositionInWorld
};

export type {
	World
};
