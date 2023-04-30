import { createIgnoranceSpreader, createIgnorant, createspaghettiMonster } from "../src/actor";
import { temperatureRise, spreadIgnorance, movingVector } from "../src/actor_actions";
import { createVector } from "../src/geometry";
import { createWorld } from "../src/world";
import { setHunger, setSpreadIgnorancePower } from "../src/props";

test("TemperatureRise test", () => {
    const world = createWorld(5, 5, 0);

    const monster = createspaghettiMonster(createVector(2, 2), 1);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), undefined);
    const onPoint = setHunger(createIgnorant(createVector(2, 2), createVector(0, 0)), 3);
    
    const actors = [monster, ignorant, onPoint];

    // The ignorant is not at the same position as the spaghetti monster, so it souldn't eat the spaghetti monster
    expect(temperatureRise(actors, ignorant)).toBe(0);

    // Ignorant on the same position as the spaghetti monster, should eat the spaghetti monster
    expect(temperatureRise(actors, onPoint)).toBe(3);
});


test("spreadIgnorance test", () => {
    
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), undefined);
    const ignoranceSpreader = setSpreadIgnorancePower(createIgnoranceSpreader(createVector(0, 0), createVector(0, 0)), 3);
    // const actors = [ignorant, ignoranceSpreader];

    // Not enough specifications to make this tests, waiting fot the team to decide a correct behavior
    // Spreading ignorance to a fully ignorant ignorant, should not increase its ignorance
    // expect(spreadIgnorance(actors, ignoranceSpreader).amount[0]).toBe(0);
    // IgnorantSpreader shouldn't increase its own ignorance
    expect(spreadIgnorance([ignoranceSpreader], ignoranceSpreader).amount.length).toBe(0);
    
    // ignorant shouldn't spread ignorance
    // expect(spreadIgnorance([ignorant], ignorant).amount.length).toBe(0);
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
