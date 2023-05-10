import { isDeepStrictEqual } from "./util";

/**
 * Computes the sum of all the elements of the array
 * @param array the array
 * @returns the sum of all the elements of the array
 */
function sum(array: Array<number>) {
	return array.reduce((acc, current) => acc + current, 0);
}

/**
 * Returns a new instance of the given array without the element of this array that is at the given index
 * @param arr the array on which an element is removed
 * @param index the index at which the element of the array is removed
 * @returns a new instance of the given array without the element of this array that is at the given index
 */
function arrayWithoutElementAtIndex<T>(arr: Array<T>, index: number): Array<T> {
	return arr.slice(0, index).concat(arr.slice(index + 1));
}

/**
 * Shuffles a new instance of the given array using a pure recursive version of the Fisher-Yates shuffle algorithm
 * @param arrayToShuffle the array to shuffle
 * @returns a shuffled new instance of the given array using a pure recursive version of the Fisher-Yates shuffle algorithm
 */
function fisherYatesShuffle<T>(arrayToShuffle: Array<T>): Array<T> {
	function fisherYatesShuffleTailRecursive(alreadyShuffled: Array<T>, restToShuffle: Array<T>): Array<T> {
		if (restToShuffle.length === 0) return alreadyShuffled;
		const randomIndex = Math.random() * restToShuffle.length;
		return fisherYatesShuffleTailRecursive(alreadyShuffled.concat(restToShuffle[randomIndex]), arrayWithoutElementAtIndex(restToShuffle, randomIndex));
	}
	return fisherYatesShuffleTailRecursive([], arrayToShuffle);
}

/**
 * Returns a random element from the given array that is not in the other given array, or undefined
 * @param fromArray the array from where the random element is returned
 * @param otherArray the array containing the elements that must not be returned
 * @returns a random element from the given array that is not in the other given array, or undefined
 */
function getRandomArrayElementNotInOtherArray<T>(fromArray: Array<T>, otherArray: Array<T>): T | undefined {
	if (!fromArray.length) {
		throw new Error('Cannot get a random element from an empty array');
	}
	const randomIndexOrder: Array<number> = Array.from({length: fromArray.length}, (_, i) => (i));
	const elementIndex: number | undefined = randomIndexOrder.reduce(
		(acc, randomIndex) => {
			if (acc === undefined && !otherArray.some((el) => isDeepStrictEqual(el, fromArray[randomIndex]))) {
				return randomIndex;
			}
			return acc;
		},
	undefined);
	return elementIndex === undefined ? undefined : fromArray[elementIndex];
}

/**
 * Returns a random element from the given array
 * @param fromArray the array from where the random element is returned
 * @returns a random element from the given array
 */
function getRandomArrayElement<T>(fromArray: Array<T>): T {
	if (!fromArray.length) {
		throw new Error('Cannot get a random element from an empty array');
	}
	return fromArray[Math.floor(Math.random() * fromArray.length)];
}

export { sum, getRandomArrayElement, getRandomArrayElementNotInOtherArray, arrayWithoutElementAtIndex, fisherYatesShuffle};