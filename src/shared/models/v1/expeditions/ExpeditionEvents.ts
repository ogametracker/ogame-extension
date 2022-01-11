import { ItemHash } from "../items/Item";
import { ResourceType } from "../ogame/resources/ResourceType";
import { ShipType } from "../ogame/ships/ShipType";
import { ExpeditionEventSize } from "./ExpeditionEventSize";
import { ExpeditionEventType } from "./ExpeditionEventType";

interface ExpeditionEventBase {
    id: number;
    date: number;
    type: ExpeditionEventType;
}

interface ExpeditionEventWithSize {
    size: ExpeditionEventSize;
}

export type ExpeditionEventDarkMatter = ExpeditionEventBase & ExpeditionEventWithSize & {
    type: ExpeditionEventType.darkMatter;
    darkMatter: number;
};

export type ExpeditionEventResourcesAmount = Record<ResourceType, number>;

export type ExpeditionEventResources = ExpeditionEventBase & ExpeditionEventWithSize & {
    type: ExpeditionEventType.resources;
    resources: ExpeditionEventResourcesAmount;
};

export type ExpeditionFindableShipType = Exclude<ShipType, ShipType.crawler | ShipType.colonyShip | ShipType.deathStar | ShipType.recycler | ShipType.solarSatellite>;

export type ExpeditionFindableFleet = Record<ExpeditionFindableShipType, number | undefined>;

export type ExpeditionEventFleet = ExpeditionEventBase & ExpeditionEventWithSize & {
    type: ExpeditionEventType.fleet;
    fleet: ExpeditionFindableFleet;
};

export type ExpeditionEventItem = ExpeditionEventBase & {
    type: ExpeditionEventType.item;
    itemHash: ItemHash;
};

export type ExpeditionEventEarly = ExpeditionEventBase & {
    type: ExpeditionEventType.early;
};

export type ExpeditionEventDelay = ExpeditionEventBase & {
    type: ExpeditionEventType.delay;
};

export type ExpeditionEventTrader = ExpeditionEventBase & {
    type: ExpeditionEventType.trader;
};

export type ExpeditionEventLostFleet = ExpeditionEventBase & {
    type: ExpeditionEventType.lostFleet;
};

export type ExpeditionEventNothing = ExpeditionEventBase & {
    type: ExpeditionEventType.nothing;
};

export type ExpeditionEventAliens = ExpeditionEventBase & ExpeditionEventWithSize & {
    type: ExpeditionEventType.aliens;
};

export type ExpeditionEventPirates = ExpeditionEventBase & ExpeditionEventWithSize & {
    type: ExpeditionEventType.pirates;
};

export type ExpeditionEvent = ExpeditionEventDarkMatter
    | ExpeditionEventResources
    | ExpeditionEventFleet
    | ExpeditionEventItem
    | ExpeditionEventEarly
    | ExpeditionEventDelay
    | ExpeditionEventTrader
    | ExpeditionEventLostFleet
    | ExpeditionEventNothing
    | ExpeditionEventPirates
    | ExpeditionEventAliens;

export type ExpeditionEventCollection = Record<number, ExpeditionEvent>;