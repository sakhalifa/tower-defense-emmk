import { createGoodGuy, createIgnoranceSpreader, createIgnorant, createSpawner, createWalker, createSpaghettiMonster, createPlayer, createGround, createActor } from "../src/actor_creators";
import { temperatureRise, spreadIgnorance, spawn, moveTowardWaypointTarget, convertEnemies, play, playPriorityAroundLoneGrounds } from "../src/actor_actions";
import { createVector, euclideanDistance } from "../src/utils/geometry";
import { createWorld, getVectorsInRangeInWorld } from "../src/world";
import { setConviction, setSpreadIgnorancePower, setRange } from "../src/props";
import { setSpawnProba } from "../src/props";

test("Spawn test", () => {
    const world = createWorld(5, 5);
    const always_spawn = createSpawner(createVector(0, 0), 1);
    const never_spawn = createSpawner(createVector(0, 0), 0);
    expect(spawn({actorsAcc: [], actingActor: always_spawn, world, spawnersAxis: 'y'})).not.toBeUndefined();
    expect(spawn({actorsAcc: [], actingActor: never_spawn, world, spawnersAxis: 'y'})).toBeUndefined();
});

test("TemperatureRise test", () => {
    const world = createWorld(5, 5);

    const monster = createSpaghettiMonster(createVector(2, 2), 1);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), undefined);
    const onPoint = setConviction(createIgnorant(createVector(2, 2), createVector(0, 0)), 3);
    
    const actors = [monster, ignorant, onPoint];

    // The ignorant is not at the same position as the spaghetti monster, so it souldn't eat the spaghetti monster
    expect(temperatureRise({actorsAcc: actors, actingActor: ignorant, world, spawnersAxis: 'y'})).toBe(0);

    // Ignorant on the same position as the spaghetti monsteexpect(Stack.stackCreateEmpty()).toEqual({});r, should eat the spaghetti monster
    expect(temperatureRise({actorsAcc: actors, actingActor: onPoint, world, spawnersAxis: 'y'})).toBe(3);
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
    expect(spreadIgnorance({actorsAcc: [ignoranceSpreader], actingActor: ignoranceSpreader, world, spawnersAxis: 'y'}).impactAmounts).toHaveLength(0);
    
    // ignorant shouldn't spread faithPoints
    // expect(spreadIgnorance([ignorant], ignorant).amount.length).toBe(0);
});

test("moveTowardWaypointTarget test", () => {
    const world = createWorld(5, 5);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 1), 0);
    expect(moveTowardWaypointTarget({actorsAcc: [], actingActor: ignorant, world, spawnersAxis: 'y'})).toEqual(createVector(0, 1));
});

test("convertEnemies test", () => {
    const world = createWorld(5, 5);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 1), 10);
    const ignorant_away = createIgnorant(createVector(5, 5), createVector(0, 1), 10);
    const good_guy = createGoodGuy(createVector(0, 0), 2, 0);
    expect(convertEnemies({actorsAcc: [], actingActor: good_guy, world, spawnersAxis: 'y'}).impactAmounts).toHaveLength(0);
    expect(convertEnemies({actorsAcc: [ignorant, ignorant_away, ignorant_away, good_guy], actingActor: good_guy, world, spawnersAxis: 'y'}).impactAmounts).toHaveLength(1);
    expect(convertEnemies({actorsAcc: [ignorant, ignorant_away, ignorant_away, good_guy], actingActor: good_guy, world, spawnersAxis: 'y'}).impactedActorsIndices[0]).toBe(0);
    expect(convertEnemies({actorsAcc: [ignorant, ignorant_away, ignorant_away, good_guy], actingActor: good_guy, world, spawnersAxis: 'y'}).impactAmounts[0]).toBe(-1 * 0);
    expect(convertEnemies({actorsAcc: [ignorant, ignorant, ignorant, good_guy], actingActor: good_guy, world, spawnersAxis: 'y'}).impactAmounts).toHaveLength(3);
});

test("play test", () => {
    const world = createWorld(5, 5);
    const ignorant = createIgnorant(createVector(0, 0), createVector(0, 0), 0);
    const player = createPlayer(0);
    expect(play({actorsAcc: [ignorant], actingActor: player, world, spawnersAxis: 'y'})).toBeUndefined();
});

xtest("playPriorityAroundLoneGrounds test", () => {
    const world = createWorld(5, 5);
    const bottomGround = createGround(createVector(4, 1));
    const rightGround = createGround(createVector(1, 4));
    const topLeftGround = createGround(createVector(1, 1));
    const grounds = [topLeftGround, bottomGround, rightGround];
    const player = createPlayer(1);
    const range = 2;
    const distanceFunction = euclideanDistance;
    const xAxisSolutions = getVectorsInRangeInWorld(range, euclideanDistance, world, bottomGround.position);
    const yAxisSolutions = getVectorsInRangeInWorld(range, euclideanDistance, world, rightGround.position);
    expect(xAxisSolutions).toContainEqual(playPriorityAroundLoneGrounds({actorsAcc: grounds, actingActor: player, world, spawnersAxis: "x"}, range, distanceFunction));
    expect(yAxisSolutions).toContainEqual(playPriorityAroundLoneGrounds({actorsAcc: grounds, actingActor: player, world, spawnersAxis: "y"}, range, distanceFunction));
});