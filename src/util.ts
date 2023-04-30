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

function isDeepStrictEqual(object1: any, object2: any) {
	if(object1 !== object2 && (object1 === undefined || object2 === undefined))
		return false;
	const objKeys1 = Object.keys(object1);
	const objKeys2 = Object.keys(object2);

	if (objKeys1.length !== objKeys2.length) return false;

	for (const key of objKeys1) {
		const value1 = object1[key];
		const value2 = object2[key];

		const isObjects = isObject(value1) && isObject(value2);

		if ((isObjects && !isDeepStrictEqual(value1, value2)) ||
			(!isObjects && value1 !== value2)
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

export type { Axis };

export { sum, getRandomArrayElement, stringReplaceAt, isDeepStrictEqual, isObject };