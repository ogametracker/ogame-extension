import ExpoSize from "./ExpoSize";
import ExpoType from "./ExpoType";

import Fleet from '../Fleet';
import Item from "../items/Item";
import Resource from "../Resource";
import Ship from "../Ship";


export interface ExpoEventBase {
    id: number;
    date: number;
    type: ExpoType;
}

export interface ExpoSizeableEvent {
    size: ExpoSize;
}

export type ExpoEventDarkMatter = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.darkMatter;
    darkMatter: number;
};

export type ExpoEventResourcesList = Record<Resource, number>;

export type ExpoEventResources = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.resources;
    resources: ExpoEventResourcesList;
};

export enum ExpoFindableShips {
    lightFighter = Ship.lightFighter,
    heavyFighter = Ship.heavyFighter,
    cruiser = Ship.cruiser,
    battleship = Ship.battleship,
    battlecruiser = Ship.battlecruiser,
    bomber = Ship.bomber,
    destroyer = Ship.destroyer,
    reaper = Ship.reaper,
    pathfinder = Ship.pathfinder,
    smallCargo = Ship.smallCargo,
    largeCargo = Ship.largeCargo,
    espionageProbe = Ship.espionageProbe,
}


export type ExpoFindableFleet = Record<ExpoFindableShips, number | undefined>;

export type ExpoEventFleet = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.fleet;
    fleet: ExpoFindableFleet;
};

export type ExpoEventItem = ExpoEventBase & {
    type: ExpoType.item;
    itemHash: string;
};

export type ExpoEventEarly = ExpoEventBase & {
    type: ExpoType.early;
};

export type ExpoEventDelay = ExpoEventBase & {
    type: ExpoType.delay;
};

export type ExpoEventTrader = ExpoEventBase & {
    type: ExpoType.trader;
};

export type ExpoEventLostFleet = ExpoEventBase & {
    type: ExpoType.lostFleet;
};

export type ExpoEventNothing = ExpoEventBase & {
    type: ExpoType.nothing;
};

export type ExpoEventAliens = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.aliens;
};

export type ExpoEventPirates = ExpoEventBase & ExpoSizeableEvent & {
    type: ExpoType.pirates;
};

type ExpoEvent = ExpoEventDarkMatter
    | ExpoEventResources
    | ExpoEventFleet
    | ExpoEventItem
    | ExpoEventEarly
    | ExpoEventDelay
    | ExpoEventTrader
    | ExpoEventLostFleet
    | ExpoEventNothing
    | ExpoEventPirates
    | ExpoEventAliens;
export default ExpoEvent;