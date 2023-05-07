import type { Actor } from "../src/actor";
import type { Vector2D } from "../src/geometry";

import { createPhase } from "../src/phase";

test("createPhase test", () => {
    const myFunc = (_: Array<Actor>, __: Array<Vector2D>) => _;
    expect(createPhase("move", myFunc))
        .toEqual({ 
            funcName: "move", 
            executePhase: myFunc });
});

