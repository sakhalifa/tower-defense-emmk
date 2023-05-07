import type { Actor } from "../src/actor";
import type { Vector2D } from "../src/geometry";
import type { ActorActions } from "../src/actor_actions";

import { createPhase } from "../src/phase";

test("createPhase test", () => {
    const myFunc = (oldActors: Array<Actor>, phaseResults: Array<ReturnType<ActorActions["move"]>>) => oldActors;
    expect(createPhase("move", myFunc))
        .toEqual({ 
            funcName: "move", 
            executePhase: myFunc });
});

