type Vector2D = { x: number, y: number; };

type Matrix<T> = Array<Array<T>>;

function createMatrix<T>(width: number, height: number, defaultValue: T) {
	return Array(height).map((_) => Array(width).map((_) => defaultValue));
}

function translatePoint(p: Vector2D, dx: number, dy: number) {
	return { x: p.x + dx, y: p.y + dy };
}

function printVector2D(v: Vector2D) {

}

function printMatrix<T>(m: Matrix<T>, printElement: (e: T) => void) {

}

export { translatePoint };

export type { Vector2D, Matrix, createMatrix };
