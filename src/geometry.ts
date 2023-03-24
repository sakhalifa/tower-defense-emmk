import { isDeepStrictEqual } from "util";

type Vector2D = { x: number, y: number; };

type Matrix<T> = Array<Array<T>>;

function translatePoint(p: Vector2D, dx: number, dy: number) {
	return { x: p.x + dx, y: p.y + dy };
}

function vector2DToString(v: Vector2D){
	return `(${v.x}, ${v.y})`
}

function matrixToString<T>(m: Matrix<T>, elementToString: (e: T) => string){
	return m.map((row) => {
		return `[ ${row.map((cell) => cell ? elementToString(cell) : " ").join(", ")} ]`
	}).join("\n")
}

export { translatePoint, matrixToString, vector2DToString };

export type { Vector2D, Matrix };