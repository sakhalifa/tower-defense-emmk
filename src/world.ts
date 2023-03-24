import type { Actor } from "./actor";
import type { Matrix } from "./geometry";

type World = {
	actors: Matrix<Actor>;
	width: number;
	height: number;
};


function createWorld(width: number, height: number, actors: Array<Actor>) {

	const rawMatrix = createMatrix(width, height, undefined);

	return { actors: rawMatrix, width: width, height: height };
}

function printWorld(w: World) {

}
export type {
	World, createWorld
};
