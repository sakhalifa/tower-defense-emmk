import type { Actor } from "../src/actor";
import { createPhase } from "../src/phase";
import { translateActor } from "../src/actor";
import { Vector2D, createVector } from "../src/geometry";

test("createPhase test", () => {
    const myFunc = (_: Array<Actor>, __: Array<Vector2D>) => _;
    expect(createPhase("move", myFunc))
        .toEqual({ 
            funcName: "move", 
            executePhase: myFunc });
});

