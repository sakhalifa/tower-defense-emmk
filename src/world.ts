import type { Vector2D } from "./geometry";

import { Direction } from "./directions";
import { createVector } from "./geometry";

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
	if (width <= 0 || height <= 0){
		throw new Error("World size values must be positive");
	}
	if (!Number.isInteger(width) || !Number.isInteger(height)){
		throw new Error("World size values must be integers");
	}
	return {
		width: width,
		height: height,
		turnsElapsed
	};
}

/**
 * Returns a random position in the world which is on the edge of the world corresponding to the given direction
 * @param world the world on which the position is computed
 * @param edge the edge on which the position is located
 * @returns a random position in the world which is on the edge of the world corresponding to the given direction
 */
function randomPositionOnEdge(world: World, edge : Direction): Vector2D {
	switch (edge) {
		case Direction.east:
			return createVector(world.width - 1, Math.floor(Math.random() * world.height));
		case Direction.west:
			return createVector(0, Math.floor(Math.random() * world.height));
		case Direction.north:
			return createVector(Math.floor(Math.random() * world.width), 0);
		case Direction.south:
			return createVector(Math.floor(Math.random() * world.width), world.height - 1);
		default:
			throw new Error(`${edge} is not a valid direction`);
	}
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

/**
 * Returns the position of the character representing the content of what is at the position described by the given vector, in the given world
 * @param world the world represented by a string where a character represents the given vector
 * @param vector the vector representing the position, represented as a character in the world string representation
 * @returns the position of the character representing the content of what is at the position described by the given vector, in the given world
 */
function worldStringVectorToIndex(world: World, vector: Vector2D): number {
	if (!isPositionInWorld(world, vector)){
		throw new Error("Position is not in world");
	}
	return vector.y * (world.width * 2 + 1) + vector.x * 2;
}

export type { World };

export { createWorld, worldToString, isPositionInWorld, worldStringVectorToIndex, randomPositionOnEdge };
