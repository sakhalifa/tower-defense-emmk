import { arrayWithoutElementAtIndex, sum, fisherYatesShuffle, getRandomArrayElementNotInOtherArray, getRandomArrayElement } from "../src/utils/array_utils";


test("sum test", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
    expect(sum([0])).toBe(0);
    expect(sum([-1, 2, 3, -4])).toBe(0);

});

test("arrayWithoutElementAtIndex test", () => {
    expect(arrayWithoutElementAtIndex([0], 0)).toEqual([]);
    expect(arrayWithoutElementAtIndex([0, 1, 2], 0)).toEqual([1, 2]);
    expect(arrayWithoutElementAtIndex([0, 1, 2], 3)).toEqual([0, 1, 2]);
});

test("fisherYatesShuffle test", () => {
    expect(fisherYatesShuffle([0])).toEqual([0]);
    expect(fisherYatesShuffle([1, 2, 3])).toContain(1);
    expect(fisherYatesShuffle([1, 2, 3])).toContain(2);
    expect(fisherYatesShuffle([1, 2, 3])).toContain(3);
});

test("getRandomArrayElementNotInOtherArray test", () => {
    expect(getRandomArrayElementNotInOtherArray([0], [0])).not.toBeDefined();
    expect(getRandomArrayElementNotInOtherArray([0, 1, 2], [0, 1])).toBe(2);
    expect(() => getRandomArrayElementNotInOtherArray([], [1, 2])).toThrow();
});

test("getRandomArrayElement test", () => {
   expect(() => getRandomArrayElement([])).toThrow();
   expect(getRandomArrayElement([1])).toBe(1);
});