import { createActor, createGround, createIgnorant, createspaghettiMonster } from "../src/actor_creators";
import { enemyFleePhase, movePhase, spawnPhase, temperatureRisePhase } from "../src/game_phases";
import { createVector } from "../src/geometry";
import { defaultActions, enemyFlee } from "../src/actor_actions";
import { setWaypointTarget, setWaypointTargetNumber } from "../src/props";


test("SpawnPhase test", () => {
    const newActor = createActor(createVector(0, 0), defaultActions, "ignorant");
    expect(spawnPhase([], [])).toEqual([]);
    expect(spawnPhase([], [newActor])).toEqual([newActor]);
    expect(spawnPhase([newActor], [newActor])).toEqual([newActor, newActor]);
}); 

// Temperature rise phase => Resolve faith_point issue first !
xtest("TemperatureRisePhase test", () => {
    const actor1 = createActor(createVector(0, 0), defaultActions, "ignorant");
    const actor2 = createActor(createVector(0, 0), defaultActions, "ignorant");
    const actor3 = createActor(createVector(0, 0), defaultActions, "ignorant");
    expect(temperatureRisePhase([], [])).toEqual([]);
    expect(temperatureRisePhase([actor1], [0])).toEqual([actor1]);
    expect(temperatureRisePhase([actor1, actor2, actor3], [100, 100, 100])).toEqual([actor1, actor2, actor3]);
    const monster = createspaghettiMonster(createVector(0, 0), 1, 10);
    const monsterSmaller = createspaghettiMonster(createVector(0, 0), 1, 5);
    expect(temperatureRisePhase([actor1, monster], [0])).toEqual([actor1, monster]);
    expect(temperatureRisePhase([actor1, monster], [5])).toEqual([actor1, monsterSmaller]);
    expect(temperatureRisePhase([actor1, monster], [10])).toEqual([actor1]);
});

// move phase
test("movePhase test", () => {
    const waypoint1 = createGround(createVector(10, 5), 0);
    const actor = setWaypointTargetNumber(createActor(createVector(0, 0), defaultActions, "ignorant"), 0);
    const movedActor = setWaypointTargetNumber(createActor(createVector(10, 5), defaultActions, "ignorant"), 0);
    expect(movePhase([], [])).toEqual([]);
    expect(movePhase([waypoint1, actor], [createVector(0, 0), createVector(10, 5)])).toEqual([waypoint1, movedActor]);
    expect(movePhase([movedActor], [createVector(-10, -5)])).toEqual([actor]);
    expect(movePhase([movedActor, waypoint1], [createVector(-10, -5), createVector(0, 0)])).toEqual([actor, waypoint1]);
    expect(movePhase([actor, movedActor, actor], [createVector(0, 0), createVector(-10, -5), createVector(10, 5)])).toEqual([actor, actor, movedActor]);
});

// update ignorance

// spreadIgnorance phase test => unclear

// Convert enemies phase tests => Resolve faith_point issue first !

// Enemy flee phase tests

test("EnemyFleePhase", () => {
    const ignorant1 = createIgnorant(createVector(0, 0), createVector(1, 1), 5);
    const ignorant2 = createIgnorant(createVector(0, 0), createVector(1, 1), 5);
    const ignorant3 = createIgnorant(createVector(0, 0), createVector(1, 1), 5);
    expect(enemyFleePhase([], [])).toEqual([]);
    expect(enemyFleePhase([ignorant1], [false])).toEqual([ignorant1]);
    expect(enemyFleePhase([ignorant1, ignorant2, ignorant3], [false, false, false])).toEqual([ignorant1, ignorant2, ignorant3]);
    expect(enemyFleePhase([ignorant1, ignorant2, ignorant3], [true, true, true])).toEqual([]);
    expect(enemyFleePhase([ignorant1, ignorant2, ignorant3, ignorant1], [false, true, true, true])).toEqual([ignorant1]);
});