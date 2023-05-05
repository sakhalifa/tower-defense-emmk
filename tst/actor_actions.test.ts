import { createGoodGuy, createIgnoranceSpreader, createIgnorant, createSpawner, createWalker, createspaghettiMonster } from "../src/actor_creators";
import { temperatureRise, spreadIgnorance, spawn, moveTowardWaypointTarget, convertEnemies, play } from "../src/actor_actions";
import { createVector } from "../src/geometry";
import { createWorld } from "../src/world";
import { setConviction, setSpreadIgnorancePower, setRange } from "../src/props";
import { setSpawnProba } from "../src/props";

test("Spawn test", () => {
    const world = createWorld(5, 5);
    const always_spawn = createSpawner(createVector(0, 0), 1);
    const never_spawn = createSpawner(createVector(0, 0), 0);
    expect(spawn([], always_spawn, world, 'y')).not.toBeUndefined();
    expect(spawn([], never_spawn, world, 'y')).toBeUndefined();
});

test("TemperatureRise test", () => {
    const world = createWorld(5, 5);

    const monster = createspaghettiMonster(createVector(2, 2), 1);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), undefined);
    const onPoint = setConviction(createIgnorant(createVector(2, 2), createVector(0, 0)), 3);
    
    const actors = [monster, ignorant, onPoint];

    // The ignorant is not at the same position as the spaghetti monster, so it souldn't eat the spaghetti monster
    expect(temperatureRise(actors, ignorant, world, 'y')).toBe(0);

    // Ignorant on the same position as the spaghetti monsteexpect(Stack.stackCreateEmpty()).toEqual({});r, should eat the spaghetti monster
    expect(temperatureRise(actors, onPoint, world, 'y')).toBe(3);
});


test("spreadIgnorance test", () => {
    const world = createWorld(5, 5);
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

test("moveTowardWaypointTarget test", () => {
    const world = createWorld(5, 5);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 1), 0);
    expect(moveTowardWaypointTarget([], ignorant, world, 'y')).toEqual(createVector(0, 1));
});


// Skip for now, wait for props to be correctly named
xtest("convertEnemies test", () => {
    const world = createWorld(5, 5);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 1), 10);
    const ignorant_away = createIgnorant(createVector(5, 5), createVector(0, 1), 10);
    const good_guy = setRange(createGoodGuy(createVector(0, 0)), 2);
    expect(convertEnemies([], good_guy, world, 'y').amount).toHaveLength(0);
    expect(convertEnemies([ignorant, ignorant_away, ignorant_away, good_guy], good_guy, world, 'y' ).amount).toHaveLength(1);
    expect(convertEnemies([ignorant, ignorant_away, ignorant_away, good_guy], good_guy, world, 'y' ).actorIndices[0]).toBe(0);
    expect(convertEnemies([ignorant, ignorant_away, ignorant_away, good_guy], good_guy, world, 'y' ).amount[0]).toBe(0);
    expect(convertEnemies([ignorant, ignorant, ignorant, good_guy], good_guy, world, 'y' ).amount).toHaveLength(3);
});

test("play test", () => {
    const world = createWorld(5, 5);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), 0);
    expect(play([], ignorant, world, 'y')).toBeUndefined();
});