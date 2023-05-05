import { Actor } from "./actor";
import { Vector2D } from "./geometry";

function setConviction(actor: Actor, conviction: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, conviction } };
}

function getConviction(actor: Actor): number {
	return actor.externalProps.conviction;
}

function setRange(actor: Actor, range: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, range } };
}

function getRange(actor: Actor): number {
	return actor.externalProps.range;
}

function getWaypointTarget(actor: Actor): Vector2D {
	return actor.externalProps.waypointTarget!;
}

function setWaypointTarget(actor: Actor, waypointTarget: Vector2D): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointTarget: waypointTarget } };
}

function getWaypointNumber(actor: Actor): number {
	return actor.externalProps.waypointNumber!;
}

function setWaypointNumber(actor: Actor, waypointNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointNumber: waypointNumber } };
}

function getWaypointTargetNumber(actor: Actor): number {
	return actor.externalProps.waypointTargetNumber!;
}

function setWaypointTargetNumber(actor: Actor, waypointTargetNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointTargetNumber: waypointTargetNumber } };
}

function getSpawnProba(actor: Actor): number {
	return actor.externalProps.spawnProba!;
}

function setSpawnProba(actor: Actor, spawnProba: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, spawnProba } };
}

export {
	setConviction, getConviction, setRange, getRange,
	getWaypointTarget, setWaypointTarget, getWaypointNumber, setWaypointNumber,
	getWaypointTargetNumber, setWaypointTargetNumber, getSpawnProba, setSpawnProba
};