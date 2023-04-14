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
function vector2DToString(v: Vector2D) {
	return `(${v.x}, ${v.y})`;
}

/**
 * Computes the distance between 2 vectors
 * @param a a vector
 * @param b another vector
 * @returns the euclidian distance between vector a and b
 */
function distance(a: Vector2D, b: Vector2D) {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

export { translatePoint, vector2DToString, createVector, distance };

export type { Vector2D };
