import { createActor, createGround, createIgnorant, createSpaghettiMonster } from "../src/actor_creators";
import { enemyFleePhase, movePhase, spawnPhase, temperatureRisePhase, spreadConvictionPhase } from "../src/execute_phases";
import { createVector } from "../src/utils/geometry";
import { defaultActions, enemyFlee } from "../src/actor_actions";
import { setFaithPoints, setWaypointTargetAndNumber } from "../src/props";
import { move } from "./actor.test";


test("SpawnPhase test", () => {
    const newActor = createActor(createVector(0, 0), {}, defaultActions, "ignorant");
    expect(spawnPhase([], [])).toEqual([]);
    expect(spawnPhase([], [newActor])).toEqual([newActor]);
    expect(spawnPhase([newActor], [newActor])).toEqual([newActor, newActor]);
}); 

test("TemperatureRisePhase test", () => {
    const actor1 = createActor(createVector(0, 0), {}, defaultActions, "ignorant");
    const actor2 = createActor(createVector(0, 0), {}, defaultActions, "ignorant");
    const actor3 = createActor(createVector(0, 0), {}, defaultActions, "ignorant");
    expect(JSON.stringify(temperatureRisePhase([], []))).toEqual(JSON.stringify([]));
    expect(JSON.stringify(temperatureRisePhase([actor1], [0]))).toEqual(JSON.stringify([actor1]));
    expect(JSON.stringify(temperatureRisePhase([actor1, actor2, actor3], [100, 100, 100]))).toEqual(JSON.stringify([actor1, actor2, actor3]));
    const monster = createSpaghettiMonster(createVector(0, 0), 1, 10);
    const monsterSmaller = createSpaghettiMonster(createVector(0, 0), 1, 5);
    expect(JSON.stringify(temperatureRisePhase([actor1, monster], [0]))).toEqual(JSON.stringify([actor1, monster]));
    expect(JSON.stringify(temperatureRisePhase([actor1, monster], [5]))).toEqual(JSON.stringify([actor1, monsterSmaller]));
    expect(JSON.stringify(temperatureRisePhase([actor1, monster], [10]))).toEqual(JSON.stringify([actor1, {...monster, externalProps: {...monster.externalProps, faithPoints: 0}}]));
});

// move phase
test("movePhase test", () => {
    const waypoint1 = createGround(createVector(10, 5), 0);
    const actor = setWaypointTargetAndNumber(createActor(createVector(0, 0), {}, defaultActions, "ignorant"), waypoint1.position, 0);
    const movedActor = setWaypointTargetAndNumber(createActor(createVector(10, 5), {}, defaultActions, "ignorant"), waypoint1.position, 0);
    expect(JSON.stringify(movePhase([], []))).toEqual(JSON.stringify([]));
    expect(JSON.stringify(movePhase([waypoint1, actor], [createVector(0, 0), createVector(10, 5)]))).toEqual(JSON.stringify([waypoint1, movedActor]));
    expect(JSON.stringify(movePhase([movedActor], [createVector(-10, -5)]))).toEqual(JSON.stringify([actor]));
    expect(JSON.stringify(movePhase([movedActor, waypoint1], [createVector(-10, -5), createVector(0, 0)]))).toEqual(JSON.stringify([actor, waypoint1]));
    expect(JSON.stringify(movePhase([actor, movedActor, actor], [createVector(0, 0), createVector(-10, -5), createVector(10, 5)]))).toEqual(JSON.stringify([actor, actor, movedActor]));
});

// update faithPoints

// spreadIgnorance phase tests
// Convert enemies phase tests
//spreadConvictionPhase tests
test("spreadConvictionPhase test", () => {
    const ignorant1 = createIgnorant(createVector(0, 0), createVector(1, 1), 5);
    expect(JSON.stringify(spreadConvictionPhase([ignorant1], [{impactedActorsIndices: [0], impactAmounts: [0]}]))).toEqual(JSON.stringify([ignorant1]));
    expect(JSON.stringify(spreadConvictionPhase([ignorant1], [{impactedActorsIndices: [0], impactAmounts: [-5]}]))).toEqual(JSON.stringify([createIgnorant(createVector(0, 0), createVector(1, 1), 0)]));
    expect(JSON.stringify(spreadConvictionPhase([ignorant1], [{impactedActorsIndices: [0], impactAmounts: [-2]}, {impactedActorsIndices: [0], impactAmounts: [-1]}]))).toEqual(JSON.stringify([createIgnorant(createVector(0, 0), createVector(1, 1), 2)]));
    expect(JSON.stringify(spreadConvictionPhase([ignorant1], [{impactedActorsIndices: [0], impactAmounts: [-2]}, {impactedActorsIndices: [0], impactAmounts: [2]}]))).toEqual(JSON.stringify([ignorant1]));
});

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