import { Actor } from "./actor";
import { Vector2D } from "./geometry";

function setAttackPower(actor: Actor, attackPower: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, attackPower } };
}

function getAttackPower(actor: Actor): number | undefined {
	return actor.externalProps?.attackPower;
}

function setHealPower(actor: Actor, healPower: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, healPower } };
}

function getHealPower(actor: Actor): number | undefined {
	return actor?.externalProps.healPower;
}

function setRange(actor: Actor, range: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, range } };
}

function getRange(actor: Actor): number | undefined {
	return actor?.externalProps.range;
}

function getNextWaypointPosition(actor: Actor): Vector2D | undefined {
	return actor?.externalProps.nextWaypointPosition;
}

function setNextWaypointPosition(actor: Actor, nextWaypointPosition: Vector2D): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, nextWaypointPosition } };
}

function getWaypointNumber(actor: Actor): number | undefined {
	return actor.externalProps.waypointNumber;
}

function setWaypointNumber(actor: Actor, waypointNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointNumber } };
}

function getNextWaypointNumber(actor: Actor): number | undefined {
	return actor.externalProps.nextWaypointNumber;
}

function setNextWaypointNumber(actor: Actor, nextWaypointNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, nextWaypointNumber } };
}

export {
	setAttackPower, getAttackPower, setHealPower, getHealPower, setRange, getRange,
	getNextWaypointPosition, setNextWaypointPosition, getWaypointNumber, setWaypointNumber,
	getNextWaypointNumber, setNextWaypointNumber
};