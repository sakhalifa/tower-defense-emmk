import type { Actor } from "../src/actor";


import { createActor, actorToString } from "../src/actor";
import { createVector } from "../src/geometry";
import { World } from "../src/world";

function move(_: Array<Actor>, __: Actor) {
    return createVector(0, 0);
}

function heal(_: Array<Actor>, __: Actor) {
    return {actorIndices: [0], amount: [0]};
}

test("Actor create test", () => {
    expect(createActor(createVector(0, 1), { move, heal }, "ignorant"))
        .toEqual({ position: createVector(0, 1), actions: { move: move, heal: heal }, kind: "ignorant" });

});

test("Actor to string test", () => {
    expect(actorToString({
        position: createVector(0, 1),
        actions: { move, heal },
        kind: "ignorant"
    })).toEqual("{position: (0, 1)}");
});