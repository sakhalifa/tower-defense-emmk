import { createHealer, createIgnorant, createSpaghettimonster } from "../src/actor";
import { temperatureRise, heal, movingVector } from "../src/actor_actions";
import { createVector } from "../src/geometry";
import { createWorld } from "../src/world";
import { setHunger, setHealPower } from "../src/props";

test("TemperatureRise test", () => {
    const world = createWorld(5, 5, 0);

    const monster = createSpaghettimonster(createVector(2, 2), 1);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), undefined);
    const onPoint = setHunger(createIgnorant(createVector(2, 2), createVector(0, 0)), 3);
    
    const actors = [monster, ignorant, onPoint];

    // The ignorant is not at the same position as the spaghetti monster, so it souldn't eat the spaghetti monster
    expect(temperatureRise(actors, ignorant)).toBe(0);

    // Ignorant on the same position as the spaghetti monster, should eat the spaghetti monster
    expect(temperatureRise(actors, onPoint)).toBe(3);
});


test("heal test", () => {
    
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), undefined);
    const healer = setHealPower(createHealer(createVector(0, 0), createVector(0, 0)), 3);
    // const actors = [ignorant, healer];

    // Not enough specifications to make this tests, waiting fot the team to decide a correct behavior
    // Healing a fully ignorant ignorant, should not heal
    // expect(heal(actors, healer).amount[0]).toBe(0);
    // Heal should heal himself
    expect(heal([healer], healer).amount.length).toBe(0);
    
    // ignorant shouldn't heal
    // expect(heal([ignorant], ignorant).amount.length).toBe(0);
});


test("movingVector test", () => {
    // default movement direction check
    expect(movingVector(createVector(0, 0), createVector(0, 0))).toEqual(createVector(0, 0));
    expect(movingVector(createVector(10, 0), createVector(0, 0))).toEqual(createVector(-1, 0));
    expect(movingVector(createVector(0, 0), createVector(10, 0))).toEqual(createVector(1, 0));
    expect(movingVector(createVector(0, -1), createVector(0, 0))).toEqual(createVector(0, 1));
    expect(movingVector(createVector(0, 3), createVector(0, 5))).toEqual(createVector(0, 1));
    expect(movingVector(createVector(8, 0), createVector(27, 0))).toEqual(createVector(1, 0));
    expect(movingVector(createVector(-8, 0), createVector(-14, 0))).toEqual(createVector(-1, 0));
    expect(movingVector(createVector(-8, 1), createVector(-8, 0))).toEqual(createVector(0, -1));

    // Order of direction choosen test
    // Should be first on the x axis, then on the y axis
    expect(movingVector(createVector(0, 0), createVector(1, 1))).toEqual(createVector(1, 0));
    expect(movingVector(createVector(0, 0), createVector(1, 2))).toEqual(createVector(1, 0));
    expect(movingVector(createVector(1, 0), createVector(1, 2))).toEqual(createVector(0, 1));
    expect(movingVector(createVector(4, 0), createVector(1, 2))).toEqual(createVector(-1, 0));
});
