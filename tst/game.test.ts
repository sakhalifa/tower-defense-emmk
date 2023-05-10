import { initWorld, initPhases, initSpawners, initGroundWaypoints, initActors } from "../src/game";
import { spreadConvictionPhase, enemyFleePhase, movePhase, spawnPhase } from "../src/execute_phases";
import { createWorld, isPositionInWorld } from "../src/world";
import { createPhase } from "../src/phase";

test("initWorld test", () => {
    // test with invalid world dimesion, should throw
    expect(() => initWorld(0, 0.4)).toThrow();
    expect(() => initWorld(61, -4)).toThrow();

    // test with valid world dimension
    expect(initWorld(10, 10)).toEqual(createWorld(10, 10));

});

test("initPhases test", () => {
    // >verify the presence of essentials phases
    expect(initPhases()).toContainEqual(createPhase("spawn", spawnPhase));
    expect(initPhases()).toContainEqual(createPhase("move", movePhase));
    expect(initPhases()).toContainEqual(createPhase("enemyFlee", enemyFleePhase));
    expect(initPhases()).toContainEqual(createPhase("convertEnemies", spreadConvictionPhase));
});

test("init Spawner test", () => {
    const world = initWorld(5, 5);
    expect(() => initSpawners(world, 0, 0, 'x', 0)).toThrow();
    expect(initSpawners(world, 1, 1, 'x', 0)).toHaveLength(1);
    expect(initSpawners(world, 1, 4, 'x', 0).length).toBeGreaterThanOrEqual(1);
    expect(() => initSpawners(world, 0, 10, 'x', 0)).toThrow();
});

test("initGroundWaypoints test", () => {
    const world = initWorld(5, 5);
    expect(initGroundWaypoints(world, 2, 2, 'y', [1, 3], 2)).toHaveLength(2);
});

test.each(initActors(initWorld(5, 5), 5, "x"))("Init actor test", (actor) => { //refactor with forEach on axis?
    expect(isPositionInWorld(initWorld(5, 5), actor.position)).toBeTruthy();
});
test.each(initActors(initWorld(5, 5), 5, "y"))("Init actor test", (actor) => {
    expect(isPositionInWorld(initWorld(5, 5), actor.position)).toBeTruthy();
});