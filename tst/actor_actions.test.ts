import { createIgnoranceSpreader, createIgnorant, createspaghettiMonster } from "../src/actor_creators";
import { temperatureRise, spreadIgnorance } from "../src/actor_actions";
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
    expect(temperatureRise(actors, ignorant, world, 'y')).toBe(0);

    // Ignorant on the same position as the spaghetti monsteexpect(Stack.stackCreateEmpty()).toEqual({});r, should eat the spaghetti monster
    expect(temperatureRise(actors, onPoint, world, 'y')).toBe(3);
});


test("spreadIgnorance test", () => {
    const world = createWorld(5, 5, 0);
    // const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), undefined);
    const ignoranceSpreader = setSpreadIgnorancePower(createIgnoranceSpreader(createVector(0, 0), createVector(0, 0)), 3);
    // const actors = [ignorant, ignoranceSpreader];

    // Not enough specifications to make this tests, waiting fot the team to decide a correct behavior
    // Spreading faithPoints to a fully ignorant ignorant, should not increase its faithPoints
    // expect(spreadIgnorance(actors, ignoranceSpreader).amount[0]).toBe(0);
    // IgnorantSpreader shouldn't increase its own faithPoints
    expect(spreadIgnorance([ignoranceSpreader], ignoranceSpreader, world, 'y').amount).toHaveLength(0);
    
    // ignorant shouldn't spread faithPoints
    // expect(spreadIgnorance([ignorant], ignorant).amount.length).toBe(0);
});
