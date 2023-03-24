import { Actor, actorToString } from "./actor";
import { Matrix, matrixToString } from "./geometry";
type World = {
	actors: Matrix<Actor>;
	width: number;
	height: number;
};


function createWorld(width: number, height: number, actors: Array<Actor>) {

	const rawMatrix = createMatrix(width, height, undefined);

	return { actors: rawMatrix, width: width, height: height };
}

function worldToString(w: World) {
	return `{
		width: ${w.width}
		height: ${w.height}
		actors:
		${matrixToString(w.actors, actorToString)}
	}`
}
export type { World };
