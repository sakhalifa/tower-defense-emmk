import { Vector2D, translatePoint } from "./../src/geometry";

import { vector2DToString } from "./../src/geometry";

test("Vector translate test", () => {
    expect(translatePoint({ x: 0, y: 0 }, { x: 0, y: 0 }))
        .toEqual({ x: 0, y: 0 });
    expect(translatePoint({ x: 5, y: 12 }, { x: -3, y: 21 }))
        .toEqual({ x: 2, y: 33 });
    expect(translatePoint({ x: 0.1, y: 0.3 }, { x: -0.1, y: -0.3 }))
        .toEqual({ x: 0, y: 0 });
});

