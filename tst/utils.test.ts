import { isObject, stringReplaceAt, isDeepStrictEqual } from "../src/utils/other_utils";
import { evenlySpacedNumbers, almostEvenlySpacedIntegers } from "../src/utils/number_utils";
import { getRandomArrayElement, sum } from "../src/utils/array_utils";

test("sum test", () => {
    // Test on integers
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([])).toBe(0);
    expect(sum([0])).toBe(0);
    expect(sum([0, 0, 0, 0, 0])).toBe(0);
    expect(sum([-1, 1, -1, 1, -1, 1])).toBe(0);
    expect(sum([-1, -1, -1, -1, -1, -1,])).toBe(-6);

    // test on float
    expect(sum([.054, .456, -0.34])).toBeCloseTo(0.17);
});


test("getRandomArrayElement", ()=>{
    // This function is random based, so this test won't be 100% reliable but can still be relevant

    // expect element to be from array
    expect(getRandomArrayElement([1])).toBe(1);

    // Run this one multiple times
    const numberArray = [1, 2, 3, 4, 5];
    expect(numberArray.includes(getRandomArrayElement(numberArray))).toBeTruthy();
    expect(numberArray.includes(getRandomArrayElement(numberArray))).toBeTruthy();
    expect(numberArray.includes(getRandomArrayElement(numberArray))).toBeTruthy();

    // Expect error if array is empty
    expect(() => getRandomArrayElement([])).toThrow();
});


test("String replace test", () => {
    expect(stringReplaceAt("Bonjour", 0, "B")).toBe("Bonjour");
    expect(stringReplaceAt("Bonjour", -1, "B")).toBe("BBonjour");
    expect(stringReplaceAt("Bonjour", -2, "B")).toBe("BBonjour");
    expect(stringReplaceAt("Bonjour", 7, "B")).toBe("BonjourB");
    expect(stringReplaceAt("Bonjour", 2, "Au revoir")).toBe("BoAu revoir");
    expect(stringReplaceAt("Bonjour", -5, "abcde")).toBe("abcdeBonjour");
    expect(stringReplaceAt("Bonjour", -3, "abcde")).toBe("abcdenjour");
});


test("isDeepStrictEqual test", () => {
    const simpleObject = {firstName: "Jon", lastName: "Doe"};
    const complexObject = {a: "a", b: [1, 2, 3], c: {a: "0", b: [1, 2, {a: 0, b: "I am complex"}]}};

    // Simple true cases
    expect(isDeepStrictEqual(1, 1)).toBeTruthy();
    expect(isDeepStrictEqual("Good morning!", "Good morning!")).toBeTruthy();
    expect(isDeepStrictEqual([1, 2, 4], [1, 2, 4])).toBeTruthy();
    expect(isDeepStrictEqual([1, 2, 4, "Hello"], [1, 2, 4, "Hello"])).toBeTruthy();

    // Simple false cases
    expect(isDeepStrictEqual(1, 2)).toBeFalsy();
    expect(isDeepStrictEqual("Good morning!", "Good night")).toBeFalsy();
    expect(isDeepStrictEqual([1, 2, 4], [1, 2, 5])).toBeFalsy();

    // Tests with undefined
    // 2 undefined, should be true
    expect(isDeepStrictEqual(undefined, undefined)).toBeTruthy();

    // 1 defined object and undefined, should be false
    expect(isDeepStrictEqual(1, undefined)).toBeFalsy();
    expect(isDeepStrictEqual("Hello", undefined)).toBeFalsy();
    expect(isDeepStrictEqual(["simpleObject", 2, 4], undefined)).toBeFalsy();
    expect(isDeepStrictEqual(simpleObject, undefined)).toBeFalsy();
    expect(isDeepStrictEqual(complexObject, undefined)).toBeFalsy();

    // Test on more complex object
    // Test on same instance, should be true
    expect(isDeepStrictEqual(simpleObject, simpleObject)).toBeTruthy();
    expect(isDeepStrictEqual(complexObject, complexObject)).toBeTruthy();
    // Test on same object, but different instances, should be true
    expect(isDeepStrictEqual(simpleObject, {firstName: "Jon", lastName: "Doe"}));
    expect(isDeepStrictEqual(complexObject, {a: "a", b: [1, 2, 3], c: {a: "0", b: [1, 2, {a: 0, b: "I am complex"}]}})).toBeTruthy();
    
    // Test on differents object, with change at differents depth, should be false
    expect(isDeepStrictEqual(simpleObject, {firstName: "Simon", lastName: "Doe"})).toBeFalsy();
    expect(isDeepStrictEqual(complexObject, {a: "a", b: [1, 2, 3], c: {a: "0", b: [1, 2, {a: 0, b: "I am very complex"}]}})).toBeFalsy();
    expect(isDeepStrictEqual(complexObject, {a: "a", b: [1, 2, 3], c: {a: "0", b: [1, 3, {a: 0, b: "I am complex"}]}})).toBeFalsy();
    expect(isDeepStrictEqual(complexObject, {a: "a", b: [1, 2, 3], c: {a: "0", b: [1, 2, {a: 0, b: "I am complex"}]}, d: 0})).toBeFalsy();

    // Test with a new field set at undefined, should be false
    expect(isDeepStrictEqual(simpleObject, {firstName: "Jon", lastName: "Doe", other: undefined})).toBeFalsy();
    expect(isDeepStrictEqual(complexObject, {a: "a", b: [1, 2, 3], c: {a: "0", b: [1, 2, {a: 0, b: "I am complex"}]}, d: undefined})).toBeFalsy();
});


test("isObject test", () => {
    // Simple thing that aren't object, to be false
    expect(isObject(1)).toBeFalsy();
    expect(isObject(1.34)).toBeFalsy();

    // test on string that aren't object, should be false
    expect(isObject("Good night")).toBeFalsy();

    // test on object, should be true
    expect(isObject({a: 0})).toBeTruthy();
});

describe("evenlySpacedNumbers test", () => {
    test.each(Array.from({length: 5}, (_, i) => i))("evenlySpacedNumbers length of returned array", (x) => {
        expect(evenlySpacedNumbers(x, 0, 10)).toHaveLength(x);
    });

    test.each(Array.from({length: 5}, (_, i) => i))("evenlySpacedNumbers limits of returned values", (x) => {
        const bounds = [x - 2, 2 - x];
        const upperBound = Math.max(bounds[0], bounds[1]);
        const lowerBound = Math.min(bounds[0], bounds[1]);
        evenlySpacedNumbers(x, bounds[0], bounds[1]).forEach((el) => {
            expect(el).toBeGreaterThanOrEqual(lowerBound);
            expect(el).toBeLessThanOrEqual(upperBound);
        });
    });

    test.each(Array.from({length: 5}, (_, i) => i + 1))("evenlySpacedNumbers same step between returned values", (x) => {
        const bounds = [x - 2, 2 - x];
        const numbers = evenlySpacedNumbers(x, bounds[0], bounds[1]);
        const firstStep = Math.abs(bounds[0] - numbers[0]);
        const lastStep = Math.abs(numbers[numbers.length - 1] - bounds[1]);
        expect(firstStep).toBeCloseTo(lastStep);
        numbers.forEach((el, index) => {if (index) expect(Math.abs(el - numbers[index - 1])).toBeCloseTo(lastStep);});
    });
});

describe("almostEvenlySpacedIntegers test", () => {
    test.each(Array.from({length: 5}, (_, i) => i))("almostEvenlySpacedIntegers length of returned array", (x) => {
        expect(almostEvenlySpacedIntegers(x, 0, 10)).toHaveLength(x);
    });

    test.each(Array.from({length: 5}, (_, i) => i))("almostEvenlySpacedIntegers limits of returned values", (x) => {
        const bounds = [x - 2, 2 - x];
        const upperBound = Math.max(bounds[0], bounds[1]);
        const lowerBound = Math.min(bounds[0], bounds[1]);
        almostEvenlySpacedIntegers(x, bounds[0], bounds[1]).forEach((el) => {
            expect(el).toBeGreaterThanOrEqual(lowerBound);
            expect(el).toBeLessThanOrEqual(upperBound);
        });
    });

    test.each(Array.from({length: 5}, (_, i) => i + 1))("almostEvenlySpacedIntegers step between returned values differ by at most 1", (x) => {
        const bounds = [x - 2, 2 - x];
        const numbers = evenlySpacedNumbers(x, bounds[0], bounds[1]);
        const firstStep = Math.abs(bounds[0] - numbers[0]);
        const lastStep = Math.abs(numbers[numbers.length - 1] - bounds[1]);
        expect(firstStep).toBeGreaterThanOrEqual(lastStep - 1);
        expect(firstStep).toBeLessThanOrEqual(lastStep + 1);
        numbers.forEach((el, index) => {if (index){
            expect(Math.abs(el - numbers[index - 1])).toBeGreaterThanOrEqual(lastStep - 1);
            expect(Math.abs(el - numbers[index - 1])).toBeLessThanOrEqual(lastStep + 1);
        }});
    });
});