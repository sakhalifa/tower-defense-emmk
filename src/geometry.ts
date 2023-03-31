import { isDeepStrictEqual } from "util";

type Vector2D = { x: number, y: number; };

function createVector(x: number, y: number) {
	return { x: x, y: y };
}

function translatePoint(origin: Vector2D, translation: Vector2D): Vector2D {
	return { x: origin.x + translation.x, y: origin.y + translation.y };
}

function vector2DToString(v: Vector2D) {
	return `(${v.x}, ${v.y})`
}

export { translatePoint, vector2DToString, createVector };

export type { Vector2D };
