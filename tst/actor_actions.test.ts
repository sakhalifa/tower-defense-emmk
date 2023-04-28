import { createIgnorant, createSpaghettimonster } from "../src/actor";
import { temperatureRise } from "../src/actor_actions";
import { createVector } from "../src/geometry";
import { createWorld } from "../src/world";

test("TemperatureRise test", () => {
    const world = createWorld(5, 5, 0);

    const monster = createSpaghettimonster(createVector(2, 2), 1);
    const ignorant = createIgnorant(createVector(0, 0), )
    
    expect()
});