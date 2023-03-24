import { Actor, actorToString } from "./actor";
import { Matrix, matrixToString } from "./geometry";
type World = {
	actors: Matrix<Actor>;
	width: number;
	height: number;
};

function createWorld() {
	throw Error()

}

function worldToString(w: World) {
	return `{
		width: ${w.width}
		height: ${w.height}
		actors:
		${matrixToString(w.actors, actorToString)}
	}`
}

export { createWorld, worldToString };
export type { World };
