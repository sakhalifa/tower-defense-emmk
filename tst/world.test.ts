import { createVector } from "../src/geometry";
import { createWorld, worldToString, isPositionInWorld, worldStringVectorToIndex } from "../src/world";

test("createWorld test", () => {
    expect(createWorld(50, 20)).toEqual({width: 50, height: 20, turnsElapsed: 0});
    expect(() => createWorld(-5, 0)).toThrow();
    expect(() => createWorld(5, 5)).toThrow();
});

test("isPositionInWorld test", () => {
    const world = createWorld(10, 10);
    // (0, 0) is in world
    expect(isPositionInWorld(world, createVector(0, 0))).toBeTruthy();
    // Position at limit is excluded
    expect(isPositionInWorld(world, createVector(10, 10))).toBeFalsy();

    // Position beyond limit is excluded
    expect(isPositionInWorld(world, createVector(100, 5))).toBeFalsy();

    // Negative position is not world 
    expect(isPositionInWorld(world, createVector(-10, 10))).toBeFalsy();
    expect(isPositionInWorld(world, createVector(10, -10))).toBeFalsy();
    expect(isPositionInWorld(world, createVector(-10, -10))).toBeFalsy();

    // Position inside world is OK
    expect(isPositionInWorld(world, createVector(1, 5))).toBeTruthy();
    expect(isPositionInWorld(world, createVector(1.2, 5.4))).toBeTruthy();
    expect(isPositionInWorld(world, createVector(1.2, 9.99999))).toBeTruthy();

    // World consisting of a line
    const lineWorld = createWorld(3, 1);

    expect(isPositionInWorld(lineWorld, createVector(1, 0))).toBeTruthy();
    expect(isPositionInWorld(lineWorld, createVector(2.99, 0))).toBeTruthy();
    expect(isPositionInWorld(lineWorld, createVector(0, 0))).toBeTruthy();

    // World consisting of a point
    const pointWorld = createWorld(1, 1);
    expect(isPositionInWorld(pointWorld, createVector(0, 0))).toBeTruthy();
    expect(isPositionInWorld(pointWorld, createVector(1, 0))).toBeFalsy();
    expect(isPositionInWorld(pointWorld, createVector(2.99, 0))).toBeFalsy();
});

test("worldToString test", () => {
    expect(worldToString(createWorld(3, 2))).toEqual("      \n      ");
    expect(worldToString(createWorld(1, 5))).toEqual("  \n  \n  \n  \n  ");
});

test("worldStringVectorToIndex test", () => {
    expect(() => worldStringVectorToIndex(createWorld(1, 2), createVector(2, 3))).toThrowError();
    expect(worldStringVectorToIndex(createWorld(2, 2), createVector(1, 1))).toBe(7);
});