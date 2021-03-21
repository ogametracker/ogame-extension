import ExpoSize from "./ExpoSize";
import ExpoType from "./ExpoType";

import Fleet from '../Fleet';
import Item from "../items/Item";
import Resource from "../Resource";


export interface ExpoEventBase {
    id: number | string;
    date: number;
    type: ExpoType;
    size?: ExpoSize;
    fleet?: Fleet;
    darkMatter?: number;
    resources?: ExpoEventResourcesList;
}

export type ExpoEventDarkMatter = ExpoEventBase & {
    type: ExpoType.darkMatter;
    size: ExpoSize;
    darkMatter: number;
}

export type ExpoEventResourcesList = Record<Resource, number>;

export type ExpoEventResources = ExpoEventBase & {
    type: ExpoType.resources;
    size: ExpoSize;
    resources: ExpoEventResourcesList;
}

export type ExpoEventFleet = ExpoEventBase & {
    type: ExpoType.fleet;
    size: ExpoSize;
    fleet: Fleet;
}

export type ExpoEventItem = ExpoEventBase & {
    type: ExpoType.item;
    item: Item;
}

export type ExpoEventEarly = ExpoEventBase & {
    type: ExpoType.early;
}

export type ExpoEventDelay = ExpoEventBase & {
    type: ExpoType.delay;
}

export type ExpoEventTrader = ExpoEventBase & {
    type: ExpoType.trader;
}

export type ExpoEventLostFleet = ExpoEventBase & {
    type: ExpoType.lostFleet;
}

export type ExpoEventNothing = ExpoEventBase & {
    type: ExpoType.nothing;
}

export type ExpoEventAliens = ExpoEventBase & {
    type: ExpoType.aliens;
    size: ExpoSize;
}

export type ExpoEventPirates = ExpoEventBase & {
    type: ExpoType.pirates;
    size: ExpoSize;
}

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