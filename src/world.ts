import { Vector2D } from "./geometry";


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

function worldStringVectorToIndex(world: World, vector: Vector2D) {
	return vector.y * (world.width + 1) + vector.x;
}

export {
	createWorld, worldToString, isPositionInWorld, worldStringVectorToIndex
};

export type {
	World
};
