import type { Axis } from "./util";

import { isDeepStrictEqual } from "./util";

/**
 * A 2D vector
 */
type Vector2D = { x: number, y: number; };

/**
 * Vector constructor
 * @param x x coordinates
 * @param y y coordinates
 * @returns a new vector with the corresponding coordinates
 */
function createVector(x: number, y: number): Vector2D {
	return { x: x, y: y };
}

/**
 * Translates a point according to a translation vector
 * @param origin The origin point
 * @param translation The translation vector
 * @returns The vector that corresponds to the origin point translated along the translation vector 
 */
function translatePoint(origin: Vector2D, translation: Vector2D): Vector2D {
	return { x: origin.x + translation.x, y: origin.y + translation.y };
}

/**
 * Returns the string representation of the vector
 * @param v the vector
 * @returns the string representation of the vector
 */
function vector2DToString(v: Vector2D): string {
	return `(${v.x}, ${v.y})`;
}

/**
 * Computes the distance between 2 vectors
 * @param a a vector
 * @param b another vector
 * @returns the euclidian distance between vector a and b
 */
function distance(a: Vector2D, b: Vector2D): number {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

/**
 * Returns a Vector2D containing the information of the movement that has to be done in order to move by one step from fromPosition towards the given toPosition.
 * First, the movement is done along the given "firstAxis" parameter.
 * @param fromPosition the initial position, before the movement
 * @param toPosition the position that we want to reach, from the fromPosition
 * @param firstAxis the movement is done along this axis first.
 * @returns a Vector2D containing the information of the movement that has to be done in order to move towards the given toPosition.
 */
function movingVector(fromPosition: Vector2D, toPosition: Vector2D, firstAxis: Axis = "x"): Vector2D {
	switch (firstAxis) {
		case "x":
			if (fromPosition.x < toPosition.x) {
				return createVector(1, 0);
			} else if (fromPosition.x > toPosition.x) {
				return createVector(-1, 0);
			} else if (fromPosition.y < toPosition.y) {
				return createVector(0, 1);
			} else if (fromPosition.y > toPosition.y) {
				return createVector(0, -1);
			} else {
				return createVector(0, 0);
			}
		case "y":
			if (fromPosition.y < toPosition.y) {
				return createVector(0, 1);
			} else if (fromPosition.y > toPosition.y) {
				return createVector(0, -1);
			} else if (fromPosition.x < toPosition.x) {
				return createVector(1, 0);
			} else if (fromPosition.x > toPosition.x) {
				return createVector(-1, 0);
			} else {
				return createVector(0, 0);
			}
		default:
			throw new Error("Unknown axis");
	}
}

function linkingPath(fromPosition: Vector2D, toPosition: Vector2D, firstAxis?: Axis): Array<Vector2D> {
	fromPosition = translatePoint(fromPosition, movingVector(fromPosition, toPosition, firstAxis));
	function linkingPathTailRecursive(fromPosition: Vector2D, toPosition: Vector2D, positionsAccumulator: Array<Vector2D>): Array<Vector2D> {
		if (isDeepStrictEqual(fromPosition, toPosition)) {
			return positionsAccumulator;
		}
		const positionToAdd = translatePoint(fromPosition, movingVector(fromPosition, toPosition));
		return linkingPathTailRecursive(positionToAdd, toPosition, positionsAccumulator.concat(fromPosition));
	}
	return linkingPathTailRecursive(fromPosition, toPosition, []);
}

export { translatePoint, vector2DToString, createVector, distance, movingVector, linkingPath };

export type { Vector2D };
