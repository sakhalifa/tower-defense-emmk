import { isDeepStrictEqual } from "util";

type Vector2D = { x: number, y: number; };


function translatePoint(p: Vector2D, dx: number, dy: number) {
	return { x: p.x + dx, y: p.y + dy };
}

function vector2DToString(v: Vector2D){
	return `(${v.x}, ${v.y})`
}

export { translatePoint, vector2DToString };

export type { Vector2D };
