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

export type ExpeditionEventResourcesAmount = Record<Resource, number>;

export type ExpeditionEventResources = ExpeditionEventBase & ExpeditionEventWithSize & {
    type: ExpeditionEventType.resources;
    resources: ExpeditionEventResourcesAmount;
};

// export type ExpeditionFindableShips = Exclude<Ship, > {
//     lightFighter = Ship.lightFighter,
//     heavyFighter = Ship.heavyFighter,
//     cruiser = Ship.cruiser,
//     battleship = Ship.battleship,
//     battlecruiser = Ship.battlecruiser,
//     bomber = Ship.bomber,
//     destroyer = Ship.destroyer,
//     reaper = Ship.reaper,
//     pathfinder = Ship.pathfinder,
//     smallCargo = Ship.smallCargo,
//     largeCargo = Ship.largeCargo,
//     espionageProbe = Ship.espionageProbe,
// }


export type ExpeditionFindableFleet = Record<ExpeditionFindableShips, number | undefined>;

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