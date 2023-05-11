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

/**
 * Check with deep equality wether two given objects (or primary types) are equal
 * @param object1 one of the two compared objects
 * @param object2 the other one of the two compared objects
 * @returns true if the two given objects are equal, using deep equality
 */
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

/**
 * Returns true if the tested value's type is Object
 * @param object the tested value
 * @returns true if the tested value's type is Object
 */
function isObject(object: any): boolean {
	return object !== null && typeof object === "object";
}

/**
 * Type representing axes in a basis
 */
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
 * Pure functionnal decorator used to call the given function "func" every "n" call of the decorator,
 * and call the given function "defaultFunc" when "func" isn't called
 * @param func the function that have to be called every n call of the decorator
 * @param defaultFunc the function to call otherwise
 * @param n func is called every n call
 * @param currentN counter, compared to n
 * @returns the new decorator (pure functionnal decorator) and the current returned value (by func or defaultFunc)
 */
function executeFunctionEveryNCall<T extends (...args: any[]) => any>(func: T, defaultFunc: T, n: number, currentN: number = 0)
	: [() => [any, T], T] //any is used but should be "typeof executeFunctionEveryNCallClosure". The idea is to have a recursive type
{
	function executeFunctionEveryNCallClosure(currentNClosure: number): [typeof executeFunctionEveryNCallClosure, T] {
		const nextFunc: T = !currentNClosure ? func : defaultFunc;
		return [() => executeFunctionEveryNCallClosure((currentNClosure + 1) % n), nextFunc];
	}
	return executeFunctionEveryNCallClosure(currentN) as [() => [any, T], T];
}

/**
 * Returns true if the given value is not undefined
 * @param value the checked value
 * @returns true if the given value is not undefined
 */
function isNotUndefined<T>(value: T | undefined): value is T {
	return value !== undefined;
}

/**
 * Throws an error if the given value is undefined
 * @param value the checked value
 */
function throwErrorIfUndefined<T>(value: T | undefined): void {
	if (!isNotUndefined(value)) {
		throw new Error("unexpected undefined value");
	}
}

export type { Axis };

export { stringReplaceAt, isDeepStrictEqual, isObject, otherAxis, executeFunctionEveryNCall,
	throwErrorIfUndefined };