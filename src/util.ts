function sum(array: Array<number>) {
	return array.reduce((p, c) => p + c, 0);
}

export { sum };