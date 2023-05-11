import { fisherYatesShuffle } from "./array_utils";

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

export { randomUniqueMinIntegers, almostEvenlySpacedIntegers, evenlySpacedNumbers, randomUniqueIntegers };