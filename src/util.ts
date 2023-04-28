/**
 * Computes the sum of all the elements of the array
 * @param array the array
 * @returns the sum of all the elements of the array
 */
function sum(array: Array<number>) {
	return array.reduce((p, c) => p + c, 0);
}

//not pure
function getRandomArrayElement<T>(fromArray: Array<T>): T {
	if (fromArray.length === 0) {
		throw new Error('Cannot get a random element from an empty array');
	}
	return fromArray[Math.floor(Math.random() * fromArray.length)];
}

/**
 * Substitutes the i-th character of a string with another string.
 * @param baseString The string to replace the character
 * @param index The index to replace the character
 * @param replacement The replacement string
 * @returns The string with the replaced character
 */
function stringReplaceAt(baseString: string, index: number, replacement: string): string {
	return baseString.substring(0, index) + replacement + baseString.substring(index + replacement.length);
}

export { sum, getRandomArrayElement, stringReplaceAt };