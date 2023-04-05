import type { Vector2D } from "./../src/geometry";

import { vector2DToString, translatePoint, createVector } from "./../src/geometry";


test("Vector create test", () => {
    expect(createVector(0, 0)).toEqual({ x: 0, y: 0 });
    expect(createVector(0, 0.1000)).toEqual({ x: 0, y: 0.1 });
    expect(createVector(.4, -4102)).toEqual({ x: .4, y: -4102 });
});

test("Vector translate test", () => {
    expect(translatePoint({ x: 0, y: 0 }, { x: 0, y: 0 }))
        .toEqual({ x: 0, y: 0 });
    expect(translatePoint({ x: 5, y: 12 }, { x: -3, y: 21 }))
        .toEqual({ x: 2, y: 33 });
    expect(translatePoint({ x: 0.1, y: 0.3 }, { x: -0.1, y: -0.3 }))
        .toEqual({ x: 0, y: 0 });
});


test("Vector to string test", () => {
    expect(vector2DToString({ x: 0, y: 0 }))
        .toEqual("(0, 0)");
    expect(vector2DToString({ x: -456, y: 1220100 }))
        .toEqual("(-456, 1220100)");
    expect(vector2DToString({ x: 0.45673, y: 1274849.230 }))
        .toEqual("(0.45673, 1274849.23)");
});

