import { Vector2D } from "./geometry";


type World = {
	readonly width: number;
	readonly height: number;
};

function createWorld(width: number, height: number): World {
	return {
		width: width,
		height: height
	};
}

function isPositionInWorld(world: World, position: Vector2D): boolean {
	return position.x >= 0 && position.x < world.width && position.y >= 0 && position.y < world.height;
}

function worldToString(world: World): string {
	return `${' '.repeat(world.width * 2)}\n`.repeat(world.height - 1).concat(`${' '.repeat(world.width * 2)}`);
}

function vectorIndexInWorldString(world: World, vector: Vector2D): number {
	return vector.y * (world.width * 2 + 1) + vector.x * 2;
}

export {
	createWorld, worldToString, isPositionInWorld, vectorIndexInWorldString as worldStringVectorToIndex
};

export type {
	World
};
