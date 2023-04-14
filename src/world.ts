import { Vector2D } from "./geometry";

/**
 * A world. It has a width, a height and keeps track of how many turns
 * has passed.
 */
type World = {
	readonly width: number;
	readonly height: number;
	turnsElapsed: number;
};

/**
 * A world constructor
 * @param width the width of the world
 * @param height The height of the world
 * @param turnsElapsed the turns elapsed
 * @returns A world with the given width and height and turns elapsed.
 */
function createWorld(width: number, height: number, turnsElapsed: number): World {
	return {
		width: width,
		height: height,
		turnsElapsed
	};
}

/**
 * Checks if a position is in a world or not
 * @param world The world
 * @param position A position
 * @returns true iif the position is in world
 */
function isPositionInWorld(world: World, position: Vector2D): boolean {
	return position.x >= 0 && position.x < world.width && position.y >= 0 && position.y < world.height;
}

/**
 * Returns the text representation of the world
 * @param world the world
 * @returns the text representation of the world
 */
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
