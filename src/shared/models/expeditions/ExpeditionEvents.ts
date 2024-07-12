import { ItemHash } from '../ogame/items/ItemHash';
import { ResourceType } from '../ogame/resources/ResourceType';
import { ShipType } from '../ogame/ships/ShipType';
import { ExpeditionDepletionLevel } from './ExpeditionDepletionLevel';
import { ExpeditionEventSize } from './ExpeditionEventSize';
import { ExpeditionEventType } from './ExpeditionEventType';

interface ExpeditionEventBase {
    id: number;
    date: number;
    type: ExpeditionEventType;

    depletion?: ExpeditionDepletionLevel;
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

export type ExpeditionFindableShipType =
    | ShipType.lightFighter
    | ShipType.heavyFighter
    | ShipType.cruiser
    | ShipType.battleship
    | ShipType.bomber
    | ShipType.battlecruiser
    | ShipType.destroyer
    | ShipType.reaper
    | ShipType.pathfinder
    | ShipType.smallCargo
    | ShipType.largeCargo
    | ShipType.espionageProbe
    ;
export const ExpeditionFindableShipTypes: ExpeditionFindableShipType[] = [
    ShipType.lightFighter,
    ShipType.heavyFighter,
    ShipType.cruiser,
    ShipType.battleship,
    ShipType.bomber,
    ShipType.battlecruiser,
    ShipType.destroyer,
    ShipType.reaper,
    ShipType.pathfinder,
    ShipType.smallCargo,
    ShipType.largeCargo,
    ShipType.espionageProbe,
];


export type ExpeditionFindableFleet = Partial<Record<ExpeditionFindableShipType, number>>;

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
    size?: ExpeditionEventSize;
};

export type ExpeditionEventDelay = ExpeditionEventBase & {
    type: ExpeditionEventType.delay;
    size?: ExpeditionEventSize;
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

export type ExpeditionEventCombatSize = ExpeditionEventSize | 'fled-death-star';

export type ExpeditionEventAliens = ExpeditionEventBase & {
    size: ExpeditionEventCombatSize;
    type: ExpeditionEventType.aliens;
};

export type ExpeditionEventPirates = ExpeditionEventBase & {
    size: ExpeditionEventCombatSize;
    type: ExpeditionEventType.pirates;
};

export type ExpeditionEventCombat = ExpeditionEventBase & {
    size: ExpeditionEventCombatSize;
    type: ExpeditionEventType.combat;
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
    | ExpeditionEventAliens
    | ExpeditionEventCombat;