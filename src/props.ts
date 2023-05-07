import { Actor } from "./actor";
import { Vector2D } from "./geometry";

function setConviction(actor: Actor, conviction: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, conviction } };
}

function getConviction(actor: Actor): number {
	return actor.externalProps!.conviction;
}

function setRange(actor: Actor, range: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, range } };
}

function getRange(actor: Actor): number {
	return actor.externalProps!.range;
}

function getWaypointTarget(actor: Actor): Vector2D {
	return actor.externalProps!.waypointTarget!;
}

function setWaypointTarget(actor: Actor, waypointTarget: Vector2D): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointTarget } };
}

function getWaypointNumber(actor: Actor): number {
	return actor.externalProps!.waypointNumber!;
}

function setWaypointNumber(actor: Actor, waypointNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointNumber } };
}

function getWaypointTargetNumber(actor: Actor): number {
	return actor.externalProps!.waypointTargetNumber!;
}

function setWaypointTargetNumber(actor: Actor, waypointTargetNumber: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, waypointTargetNumber } };
}

function getSpawnProba(actor: Actor): number {
	return actor.externalProps!.spawnProba!;
}

function setSpawnProba(actor: Actor, spawnProba: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, spawnProba } };
}

function setSpreadIgnorancePower(actor: Actor, spreadIgnorancePower: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, spreadIgnorancePower } };
}

function getSpreadIgnorancePower(actor: Actor): number {
	return actor.externalProps!.spreadIgnorancePower;
}

function setFaithPoints(actor: Actor, faithPoints: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, faithPoints } };
}

function getFaithPoints(actor: Actor): number {
	return actor.externalProps!.faithPoints;
}

function getMaxFaith(actor: Actor): number {
	return actor.externalProps!.maxFaith;
}

function setMaxFaith(actor: Actor, maxFaith: number): Actor {
	return { ...actor, externalProps: { ...actor.externalProps, maxFaith } };
}

function getPlayProba(actor: Actor): number {
	return actor.externalProps!.playProba;
}

export {
	setConviction, getConviction, setRange, getRange,
	getWaypointTarget, setWaypointTarget, getWaypointNumber, setWaypointNumber,
	getWaypointTargetNumber, setWaypointTargetNumber, getSpawnProba, setSpawnProba,
	setSpreadIgnorancePower, getSpreadIgnorancePower, setFaithPoints, getFaithPoints, getMaxFaith,
	getPlayProba, setMaxFaith
};