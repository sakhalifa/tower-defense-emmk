import { vector2DToString, translatePoint, createVector, distance, movingVector } from "./../src/geometry";


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

test("Distance test", () => {
    expect(distance(createVector(0, 0), createVector(0, 0))).toBeCloseTo(0);
    expect(distance(createVector(0, 0), createVector(1, 1))).toBeCloseTo(1.41);
    expect(distance(createVector(0, 0), createVector(0, 10))).toBeCloseTo(10);
    expect(distance(createVector(0, 0), createVector(10, 0))).toBeCloseTo(10);
    expect(distance(createVector(0, 10), createVector(0, 0))).toBeCloseTo(10);
    expect(distance(createVector(10, 5), createVector(0, 5))).toBeCloseTo(10);
});

test("movingVector test", () => {
    // default movement direction check
    expect(movingVector(createVector(0, 0), createVector(0, 0))).toEqual(createVector(0, 0));
    expect(movingVector(createVector(10, 0), createVector(0, 0))).toEqual(createVector(-1, 0));
    expect(movingVector(createVector(0, 0), createVector(10, 0))).toEqual(createVector(1, 0));
    expect(movingVector(createVector(0, -1), createVector(0, 0))).toEqual(createVector(0, 1));
    expect(movingVector(createVector(0, 3), createVector(0, 5))).toEqual(createVector(0, 1));
    expect(movingVector(createVector(8, 0), createVector(27, 0))).toEqual(createVector(1, 0));
    expect(movingVector(createVector(-8, 0), createVector(-14, 0))).toEqual(createVector(-1, 0));
    expect(movingVector(createVector(-8, 1), createVector(-8, 0))).toEqual(createVector(0, -1));

    // Order of direction choosen test
    // Should be first on the x axis, then on the y axis
    expect(movingVector(createVector(0, 0), createVector(1, 1))).toEqual(createVector(1, 0));
    expect(movingVector(createVector(0, 0), createVector(1, 2))).toEqual(createVector(1, 0));
    expect(movingVector(createVector(1, 0), createVector(1, 2))).toEqual(createVector(0, 1));
    expect(movingVector(createVector(4, 0), createVector(1, 2))).toEqual(createVector(-1, 0));
});
