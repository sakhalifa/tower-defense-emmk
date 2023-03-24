import { isDeepStrictEqual } from 'util';

type Vector2D = { x: number, y: number; };

type Matrix<T> = Array<Array<T>>;

function createMatrix<T>(width: number, height: number): Matrix<T> {
	return Array(height).map((_) => Array(width));
}

function setElementInMatrix<T>(matrix: Matrix<T>, element: T, position: Vector2D): Matrix<T> {
	return matrix.map((line, y) => line.map((cell, x) => isDeepStrictEqual({x, y}, position) ? element : cell));
}

function translatePoint(p: Vector2D, dx: number, dy: number) {
	return { x: p.x + dx, y: p.y + dy };
}

function printVector2D(v: Vector2D) {

}

function printMatrix<T>(m: Matrix<T>, printElement: (e: T) => void) {

}

export { translatePoint, createMatrix, setElementInMatrix };

export type { Vector2D, Matrix };
