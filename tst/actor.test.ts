import type { Actor } from "../src/actor";


import { createActor, actorToString } from "../src/actor";
import { createVector } from "../src/geometry";
import { World } from "../src/world";
function move(_: World, __: Actor) {
    return createVector(0, 0);
}

function heal(_: World, __: Actor) {
    return {actorId: 0, amount: 0};
}
test("Actor create test", () => {
    
    
    expect(createActor(createVector(0, 1), { move, heal }))
        .toEqual({ pos: createVector(0, 1), actions: { move: move, heal: heal } });

});

test("Actor to string test", () => {
    expect(actorToString({
        pos: createVector(0, 1),
        actions: { move, heal }
    })).toEqual("{pos: (0, 1)}");
});