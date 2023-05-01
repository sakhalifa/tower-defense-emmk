import { createActor } from "../src/actor";
import { spawnPhase } from "../src/game_phases";
import { createVector } from "../src/geometry";
import { defaultActions } from "../src/actor_actions";


test("SpawnPhase test", () => {
    const newActor = createActor(createVector(0, 0), defaultActions, "ignorant");
    expect(spawnPhase([], [newActor])).toEqual([newActor]);
}); 