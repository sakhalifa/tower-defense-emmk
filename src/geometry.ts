
type Vector2D = { x: number, y: number; };

function createVector(x: number, y: number): Vector2D {
	return { x: x, y: y };
}

function translatePoint(origin: Vector2D, translation: Vector2D): Vector2D {
	return { x: origin.x + translation.x, y: origin.y + translation.y };
}

function vector2DToString(v: Vector2D): string {
	return `(${v.x}, ${v.y})`;
}

function distance(a: Vector2D, b: Vector2D): number {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

export { translatePoint, vector2DToString, createVector, distance };

export type { Vector2D };
