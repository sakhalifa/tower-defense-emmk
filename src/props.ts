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

function getWaypointTarget(actor: Actor): Vector2D {
	return actor?.externalProps.waypointTarget;
}

function setWaypointTarget(actor: Actor, waypointTarget: Vector2D): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointTarget: waypointTarget } };
}

function getWaypointNumber(actor: Actor): number {
	return actor.externalProps.waypointNumber;
}

function setWaypointNumber(actor: Actor, waypointNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointNumber: waypointNumber } };
}

function getWaypointTargetNumber(actor: Actor): number {
	return actor.externalProps.waypointTargetNumber;
}

function setWaypointTargetNumber(actor: Actor, waypointTargetNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointTargetNumber: waypointTargetNumber } };
}

export {
	setAttackPower, getAttackPower, setHealPower, getHealPower, setRange, getRange,
	getWaypointTarget, setWaypointTarget, getWaypointNumber, setWaypointNumber,
	getWaypointTargetNumber, setWaypointTargetNumber
};