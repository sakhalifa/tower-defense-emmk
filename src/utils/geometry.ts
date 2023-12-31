import type { Axis } from "./other_utils";

import { isDeepStrictEqual } from "./other_utils";

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
 * @returns the euclidean distance between vector a and b
 */
function euclideanDistance(a: Vector2D, b: Vector2D): number {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

/**
 * Creates a range*range square of positions centered on the position {0, 0} and filter those positions so that
 * they are in the range of {0, 0} using the given range, and the given distance function.
 * @param range the range in which the positions from the created square are kept and returned
 * @param distanceFunction the function that evaluates the distance between two positions.
 * Its return value is compared to the given range.
 * @returns all the positions that are in the range of the position {0, 0} using the given distance function.
 * The position {0, 0} is included in the result.
 */
function getMovementVectorsInRange(range: number, distanceFunction: (a: Vector2D, b: Vector2D) => number): Array<Vector2D>  {
	return Array.from({ length: 2 * range + 1 }, (_, i) =>
	Array.from({ length: 2 * range + 1 }, (_, j) => createVector(i - range, j - range))
	).flat().filter((vector) => distanceFunction(createVector(0, 0) , vector) <= range);
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

/**
 * Returns an array of positions that constitute a path between two other positions, i.e. that visualy links two other positions.
 * @param fromPosition the starting position and target position for building the path are not included in the returned array
 * @param toPosition the target position for building the path, not included in the returned array
 * @param firstAxis this parameter can be used to define the axis to prioritize for movement when multiple options are available.
 * @returns an array of positions that constitute a path between two other positions, i.e. that visualy links two other positions.
 */
function linkingPath(fromPosition: Vector2D, toPosition: Vector2D, firstAxis?: Axis): Array<Vector2D> {
	const firstProcessedPosition = translatePoint(fromPosition, movingVector(fromPosition, toPosition, firstAxis));
	function linkingPathTailRecursive(fromPosition: Vector2D, toPosition: Vector2D, positionsAccumulator: Array<Vector2D>): Array<Vector2D> {
		if (isDeepStrictEqual(fromPosition, toPosition)) {
			return positionsAccumulator;
		}
		const nextProcessedPosition = translatePoint(fromPosition, movingVector(fromPosition, toPosition, firstAxis));
		return linkingPathTailRecursive(nextProcessedPosition, toPosition, positionsAccumulator.concat(fromPosition));
	}
	return linkingPathTailRecursive(firstProcessedPosition, toPosition, []);
}

/**
 * Returns an array of positions that constitute a path linking the given positions, i.e. that visualy links the other positions.
 * @param positions two-dimensional array of positions. Positions from each "index" are linked to the positions from the "index - 1" index.
 * the positions given as parameter are not included in the returned array.
 * @param firstAxis this parameter can be used to define the axis to prioritize for movement when multiple options are available.
 * @returns an array of positions that constitute a path linking the given positions, i.e. that visualy links the other positions.
 */
function positionsLinking(positions: Array<Array<Vector2D>>, firstAxis?: Axis): Array<Vector2D> {
	return positions.reduce((acc: Array<Vector2D>, currentPositions, index) => {
		if (!index) {
			return acc;
		}
		return acc.concat(currentPositions.map((currentPosition) => positions[index - 1]
		.map((previousPosition) => linkingPath(previousPosition, currentPosition, firstAxis)).flat()).flat());
	}, []);
}

/**
 * Returns true iff the given vector respects the coordinate constraints given as parameter
 * @param vector the vector that is tested
 * @param xCoord the x coordinate constraint. If undefined, x coordinate is not a constraint.
 * @param yCoord the x coordinate constraint. If undefined, x coordinate is not a constraint.
 * @returns true iff the given vector respects the coordinate constraints given as parameter
 */
function vectorHasCoords(vector: Vector2D, xCoord?: number, yCoord?: number): boolean {
	return (xCoord === undefined || (vector.x === xCoord)) &&
	(yCoord === undefined || (vector.y === yCoord));
}

export { translatePoint, vector2DToString, createVector, euclideanDistance, movingVector, linkingPath, vectorHasCoords,
	getMovementVectorsInRange, positionsLinking };

export type { Vector2D };
