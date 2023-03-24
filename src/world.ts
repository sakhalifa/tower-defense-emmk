import type { Actor } from "./actor";
import type { Matrix } from "./geometry";

import { setElementInMatrix, createMatrix, matrixToString } from "./geometry";
import { actorToString } from "./actor";


type World = {
	actors: Matrix<Actor>;
	width: number;
	height: number;
};

function addActorToMatrix(actors: Array<Actor>, matrix: Matrix<Actor>): Matrix<Actor> {
	return actors.reduce((matrix, actor) => setElementInMatrix(matrix, actor, actor.pos), matrix);
}

function createWorld(width: number, height: number, actors: Array<Actor>) {
	return {
		actors: addActorToMatrix(actors, createMatrix(width, height)),
		width: width,
		height: height
	};
}

function worldToString(w: World) {
	return `{
		width: ${w.width}
		height: ${w.height}
		actors:
		${matrixToString(w.actors, actorToString)}
	}`;
}

export {
	createWorld, worldToString
};

export type {
	World
};
