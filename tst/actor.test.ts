import type { Actor } from "../src/actor";


import { createActor, actorToString } from "../src/actor";
import { createVector } from "../src/geometry";
import { World } from "../src/world";

test("Actor create test", () => {
    function move(_: World, __: Actor) {
        return createVector(0, 0);
    }
    expect(createActor(createVector(0, 1), { move: move }))
        .toEqual({ pos: createVector(0, 1), actions: { move: move } });

});

test("Actor to string test", () => {
    expect(actorToString({
        pos: createVector(0, 1),
        actions: { move: (_: World, __: Actor) => createVector(0, 0) }
    })).toEqual("{pos: (0, 1)}");
});