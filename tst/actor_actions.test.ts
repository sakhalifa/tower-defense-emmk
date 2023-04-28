import { createIgnorant, createSpaghettimonster } from "../src/actor";
import { temperatureRise } from "../src/actor_actions";
import { createVector } from "../src/geometry";
import { createWorld } from "../src/world";
import { setAttackPower } from "../src/props";

test("TemperatureRise test", () => {
    const world = createWorld(5, 5, 0);

    const monster = createSpaghettimonster(createVector(2, 2), 1);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), undefined);
    const onPoint = setAttackPower(createIgnorant(createVector(0, 0), createVector(0, 0)), 3);
    
    const actors = [monster, ignorant, onPoint];

    // The ignorant is not at the same position as the spaghetti monster, so it souldn't attack
    expect(temperatureRise(actors, ignorant)).toBe(0);

    // Ignorant on the same position as the spaghetti monster, should attack
    expect(temperatureRise(actors, onPoint)).toBe(3);
});