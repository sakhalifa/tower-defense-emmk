import { Vector2D, translatePoint } from "./geometry";
import { Axis } from "./util";

import { randomUniqueIntegers } from "./util";
import { createVector, linkingPath, getMovementVectorsInRange } from "./geometry";

/**
 * A world. It has a width, a height and keeps track of how many turns
 * has passed.
 */
type World = {
	readonly width: number;
	readonly height: number;
};

/**
 * A world constructor
 * @param width the width of the world
 * @param height The height of the world
 * @returns A world with the given width and height and turns elapsed.
 */
function createWorld(width: number, height: number): World {
	if (width <= 0 || height <= 0){
		throw new Error("World size values must be positive");
	}
	if (!Number.isInteger(width) || !Number.isInteger(height)){
		throw new Error("World size values must be integers");
	}
	return {
		width,
		height
	};
}

function AxisLength(world: World, axis: Axis) {
	switch (axis) {
		case "x":
			return world.width;
		case "y":
			return world.height;
		default:
			throw new Error("Unknown axis");
	}
}

/**
 * Returns an array of 1 to maxPositions random unique aligned positions
 * @param world the world on which the positions are computed
 * @param minPositions the minimum number of positions inside the returned array
 * @param maxPositions the maximum number of positions inside the returned array
 * @param axis the returned positions can reach each other by a translation along this axis
 * @param lineNumber the coordinate of the returned position on the not-given axis
 * @returns an array of 1 to maxPositions random unique positions, that all have the same coordinate value on the axis that was not given
 */
function randomPositionsAlongAxis(world: World, minPositions: number, maxPositions: number, axis: Axis, lineNumber: number): Array<Vector2D>{
	return createPositionsAlongAxis(axis, randomUniqueIntegers(minPositions, maxPositions, 0, AxisLength(world, axis)), lineNumber);
}

/**
 * Returns an array of positions corresponding to the given parameters
 * @param parallelToAxis the returned positions can reach each other by a translation along this axis
 * @param parallelAxisCoords the coordinates, on the parallel axis, of the returned positions
 * @param otherAxislineNumber the coordinate of the returned position on the not-given axis
 * @returns an array of 1 to maxPositions random unique positions, that all have the same coordinate value on the axis that was not given
 */
function createPositionsAlongAxis(parallelToAxis: Axis, parallelAxisCoords: Array<number>, otherAxislineNumber: number): Array<Vector2D>{
	return parallelAxisCoords.map((coord) => parallelToAxis === "x" ? createVector(coord, otherAxislineNumber) : createVector(otherAxislineNumber, coord));
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
function vectorToIndexInWorldString(world: World, vector: Vector2D): number {
	if (!isPositionInWorld(world, vector)){
		throw new Error("Position is not in world");
	}
	return vector.y * (world.width * 2 + 1) + vector.x * 2;
}

function positionsLinking(positions: Array<Array<Vector2D>>, firstAxis?: Axis): Array<Vector2D> {
	return positions.reduce((acc: Array<Vector2D>, currentPositions, index) => {
		if (!index) {
			return acc;
		}
		return acc.concat(currentPositions.map((currentPosition) => positions[index - 1]
		.map((previousPosition) => linkingPath(previousPosition, currentPosition, firstAxis)).flat()).flat());
	}, []);
}

function getVectorsInRangeInWorld(range: number, distanceFunction: (a: Vector2D, b: Vector2D) => number, world: World, fromPosition: Vector2D): Array<Vector2D> {
	return getMovementVectorsInRange(range, distanceFunction).map((movementVector) => translatePoint(fromPosition, movementVector))
	.filter((translatedPosition) => isPositionInWorld(world, translatedPosition));
}

function allPositionsInWorld(world: World): Array<Vector2D> {
	return Array.from({length: world.width}, (_, currentWidth) => {
		return Array.from({length: world.height}, (_, currentHeight) => createVector(currentWidth, currentHeight));
	}).flat();
}

export type { World };

export { createWorld, worldToString, isPositionInWorld, vectorToIndexInWorldString, randomPositionsAlongAxis,
	createPositionsAlongAxis, positionsLinking, AxisLength, getVectorsInRangeInWorld,
	allPositionsInWorld};
