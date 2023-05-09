/**
 * Computes the sum of all the elements of the array
 * @param array the array
 * @returns the sum of all the elements of the array
 */
function sum(array: Array<number>) {
	return array.reduce((acc, current) => acc + current, 0);
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

function isDeepStrictEqual(object1: any, object2: any) {
	if(object1 === object2)
		return true;
	if(object1 === undefined || object2 === undefined || !isObject(object1)) {
		return false;
	}
	const objKeys1 = Object.keys(object1);
	const objKeys2 = Object.keys(object2);

	if (objKeys1.length !== objKeys2.length) return false;

	for (const key of objKeys1) {
		const value1 = object1[key];
		const value2 = object2[key];

		const areObjects = isObject(value1) && isObject(value2);

		if ((areObjects && !isDeepStrictEqual(value1, value2)) ||
			(!areObjects && value1 !== value2)
		) {
			return false;
		}
	}
	return true;
}

function isObject(object: any) {
	return object !== null && typeof object === "object";
}

type Axis = "x" | "y";

/**
 * Returns an axis that is not the given axis
 * @param axis the axis that isn't returned
 */
function otherAxis(axis: Axis): Axis {
	switch (axis) {
		case "x":
			return "y";
		case "y":
			return "x";
		default:
			throw new Error("Unknown axis");
	}
}

/**
 * Return numberOfValues evenly-spaced numbers between fromValue and toValue (evenly-spaced to the bounds as well).
 * For example, 2 evenly-spaced numbers between 0 and 10 would be 3.333 and 6.666 because the steps are the same between 0, 3.333, 6.666, and 10.
 * @param numberOfValues the number of evenly spaced values to return
 * @param fromValue the minimum value that can be returned
 * @param toValue the maximum value that can be returned
 * @param mapFn an optional function to map the results
 * @returns the evenly spaced values (fromValue and toValue are not included in the returned array)
 */
function evenlySpacedNumbers(numberOfValues: number, fromValue: number, toValue: number, mapFn: (value: number) => number = (x) => x): Array<number> {
	const [min, max, indexingFunction]: [number, number, (x: number) => number] = fromValue < toValue ?
	[fromValue, toValue, index => (index + 1)]
	: [toValue, fromValue, index => (numberOfValues - index)];
	return Array.from({ length: numberOfValues }, (_, index) => mapFn(indexingFunction(index) * (max - min) / (numberOfValues + 1) + min));
}

/**
 * Return numberOfValues almost-evenly-spaced integers (step values differ at most by 1) between fromValue and toValue (almost-evenly-spaced to the bounds as well).
 * For example, 2 almost-evenly-spaced integers between 0 and 10 would be 3 and 6 because the steps are almost the same between 0, 3, 6, and 10.
 * @param numberOfValues the number of evenly spaced values to return
 * @param fromValue the minimum value that can be returned
 * @param toValue the maximum value that can be returned
 * @returns the evenly spaced values (fromValue and toValue are not included in the returned array)
 */
function almostEvenlySpacedIntegers(numberOfValues: number, fromValue: number, toValue: number): Array<number> {
	return evenlySpacedNumbers(numberOfValues, fromValue, toValue, Math.floor);
}

/**
 * Returns a random integer x such as minValue <= x < maxValue
 * @param minValue the minimum value that the returned integer can take
 * @param maxValue the (maximum + 1) value that the returned integer can take
 * @returns random integer x such as minValue <= x < maxValue
 */
function randomInteger(minValue: number, maxValue: number): number {
	return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
}

/**
 * Returns a random integer in [minValue, maxValue) and that is not present in the given "existingIntegers"
 * @param minValue the minimum value that the returned integer can take
 * @param maxValue the (maximum + 1) value that the returned integer can take
 * @param existingIntegers the returned integer must not already be present in this array
 * @returns a random integer in the given bounds and that is not present in the given "existingIntegers"
 */
function randomUniqueInteger(minValue: number, maxValue: number, existingIntegers : Array<number>) {
	let randInt = randomInteger(minValue, maxValue);
	while (existingIntegers.find((currentInt) => randInt === currentInt)) {
		randInt = randomInteger(minValue, maxValue);
	}
	return randInt;
}

/**
 * Randomly returns minNumberOfValues to maxNumberOfValues (included) random unique integers (no repetition) whose values are in [minValue, maxValue)
 * @param minNumberOfValues the minimum number of returned values
 * @param maxNumberOfValues the maximum number of returned values
 * @param minValue the minimum value that a returned value can take
 * @param maxValue the (maximum + 1) value that a returned value can take
 * @returns minNumberOfValues to maxNumberOfValues (included) random unique integers (no repetition) whose values are in [minValue, maxValue)
 */
function randomUniqueIntegers(minNumberOfValues: number, maxNumberOfValues: number, minValue: number, maxValue: number): Array<number> {
	if (maxValue - minValue < maxNumberOfValues) {
		throw new Error("It is impossible to return more than n unique values among among n values.");
	}
	if (minNumberOfValues > maxNumberOfValues || minValue > maxValue) {
		throw new Error("Params starting with 'min' must be inferior to their counterpart starting with 'max'");
	}

	function randomUniqueIntegersTailRecursive(minNumberOfValues: number, maxNumberOfValues: number, existingIntegers: Array<number>): Array<number> {
		if (!maxNumberOfValues) {
			return existingIntegers;
		}
		if (maxNumberOfValues === minNumberOfValues || Math.random() < 0.5) {
			return randomUniqueIntegersTailRecursive(minNumberOfValues - 1, maxNumberOfValues - 1, existingIntegers
				.concat(randomUniqueInteger(minValue, maxValue, existingIntegers)));
		} else {
			return randomUniqueIntegersTailRecursive(minNumberOfValues, maxNumberOfValues - 1, existingIntegers);
		}
	}
	return randomUniqueIntegersTailRecursive(minNumberOfValues, maxNumberOfValues, []);
}

function arrayWithoutElementAtIndex<T>(arr: Array<T>, index: number): Array<T> {
	return arr.slice(0, index).concat(arr.slice(index + 1));
}

function fisherYatesShuffle<T>(arrayToShuffle: Array<T>): Array<T> {
	function fisherYatesShuffleTailRecursive(alreadyShuffled: Array<T>, restToShuffle: Array<T>): Array<T> {
		if (restToShuffle.length === 0) return alreadyShuffled;
		const randomIndex = Math.random() * restToShuffle.length;
		return fisherYatesShuffleTailRecursive(alreadyShuffled.concat(restToShuffle[randomIndex]), arrayWithoutElementAtIndex(restToShuffle, randomIndex));
	}
	return fisherYatesShuffleTailRecursive([], arrayToShuffle);
}

/**
 * This function terminates, not {@link randomUniqueIntegers}.
 * Randomly returns minNumberOfValues to maxNumberOfValues (included) randomly sorted unique integers (no repetition) whose values are in [minValue, maxValue)
 * and that contain all the lowest values that can possibly be returned.
 * @param minNumberOfValues the minimum number of returned values
 * @param maxNumberOfValues the maximum number of returned values
 * @param minValue the minimum value that a returned value can take
 * @param maxValue the (maximum + 1) value that a returned value can take
 * @returns minNumberOfValues to maxNumberOfValues (included) randomly sorted unique integers (no repetition) whose values are in [minValue, maxValue)
 * and that contain all the lowest values that can possibly be returned.
 */
function randomUniqueMinIntegers(minNumberOfValues: number, maxNumberOfValues: number, minValue: number, maxValue: number): Array<number> {
	if (maxValue - minValue < maxNumberOfValues) {
		throw new Error("It is impossible to return more than n unique values among among n values.");
	}
	if (minNumberOfValues > maxNumberOfValues || minValue > maxValue) {
		throw new Error("Params starting with 'min' must be inferior to their counterpart starting with 'max'");
	}

	return fisherYatesShuffle(Array.from({length: Math.random() * (maxNumberOfValues - minNumberOfValues + 1) + minNumberOfValues}, (_, i) => (i + minValue)));
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

function executeFunctionEveryNCall<T extends (...args: any[]) => any>(func: T, defaultFunc: T, n: number, currentN: number = 0): [() => [any, T], T] { //typage any...
	function executeFunctionEveryNCallClosure(currentNClosure: number): [typeof executeFunctionEveryNCallClosure, T] {
		const nextFunc: T = !currentNClosure ? func : defaultFunc;
		return [() => executeFunctionEveryNCallClosure((currentNClosure + 1) % n), nextFunc];
	}
	return executeFunctionEveryNCallClosure(currentN) as [() => [any, T], T];
}

function isNotUndefined<T>(value: T | undefined): value is T {
	return value !== undefined;
}

function throwErrorIfUndefined<T>(value: T | undefined): void {
	if (!isNotUndefined(value)) {
		throw new Error("unexpected undefined value");
	}
}

export type { Axis };

export { sum, getRandomArrayElement, stringReplaceAt, isDeepStrictEqual, isObject,
	almostEvenlySpacedIntegers, evenlySpacedNumbers, getRandomArrayElementNotInOtherArray,
	randomUniqueIntegers, otherAxis, arrayWithoutElementAtIndex,
	fisherYatesShuffle, executeFunctionEveryNCall, throwErrorIfUndefined };