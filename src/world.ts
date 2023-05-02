import type { Vector2D } from "./geometry";
import type { Axis } from "./util";

import { isDeepStrictEqual } from "./util";
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
 * Returns a random position in the world which is computed along the given axis and line number, on the world
 * @param world the world on which the position is computed
 * @param axis the axis on which the position is computed
 * @param lineNumber the line number of the line (following the axis direction) on which the position is computed
 * @returns a random position in the world which is computed along the given axis and line number, on the world
 */
function randomPositionAlongAxis(world: World, axis : Axis, lineNumber: number): Vector2D {
	if (lineNumber < 0) {
		throw new Error("lineNumber must be > 0");
	}
	if ((axis === "x" && lineNumber > world.height - 1) || (axis === "y" && lineNumber > world.width - 1)) {
		throw new Error("lineNumber is too high, and doesn't represent any line on the world.");
	}
	switch (axis) {
		case "y":
			return createVector(lineNumber, Math.floor(Math.random() * world.height));
		case "x":
			return createVector(Math.floor(Math.random() * world.width), lineNumber);
		default:
			throw new Error(`${axis} is not a valid axis`);
	}
}

function randomUniquePositionAlongAxis(world: World, axis: Axis, lineNumber: number, existingPositions: Array<Vector2D>) {
	let newPosition = randomPositionAlongAxis(world, axis, lineNumber);
	while (existingPositions.find((currentPos) => isDeepStrictEqual(currentPos, newPosition))) {
		newPosition = randomPositionAlongAxis(world, axis, lineNumber);
	}
	return newPosition;
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

export { createWorld, worldToString, isPositionInWorld, worldStringVectorToIndex, randomPositionAlongAxis, randomUniquePositionAlongAxis };
