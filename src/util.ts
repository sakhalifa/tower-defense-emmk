/**
 * Computes the sum of all the elements of the array
 * @param array the array
 * @returns the sum of all the elements of the array
 */
function sum(array: Array<number>) {
	return array.reduce((p, c) => p + c, 0);
}

export { sum };