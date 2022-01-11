import ExpoSizev0 from "./ExpoSize";
import ExpoTypev0 from "./ExpoType";

import Fleetv0 from './Fleet';
import Itemv0 from "./Item";
import Resourcev0 from "./Resource";


export interface ExpoEventBasev0 {
    id: number | string;
    date: number;
    type: ExpoTypev0;
}

export type ExpoEventDarkMatterv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.darkMatter;
    size: ExpoSizev0;
    darkMatter: number;
};

export type ExpoEventResourcesListv0 = Record<Resourcev0, number>;

export type ExpoEventResourcesv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.resources;
    size: ExpoSizev0;
    resources: ExpoEventResourcesListv0;
};

export type ExpoEventFleetv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.fleet;
    size: ExpoSizev0;
    fleet: Fleetv0;
};

export type ExpoEventItemv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.item;
    item: Itemv0;
};

export type ExpoEventEarlyv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.early;
};

export type ExpoEventDelayv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.delay;
};

export type ExpoEventTraderv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.trader;
};

export type ExpoEventLostFleetv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.lostFleet;
};

export type ExpoEventNothingv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.nothing;
};

export type ExpoEventAliensv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.aliens;
    size: ExpoSizev0;
};

export type ExpoEventPiratesv0 = ExpoEventBasev0 & {
    type: ExpoTypev0.pirates;
    size: ExpoSizev0;
};

type ExpoEventv0 = ExpoEventDarkMatterv0
    | ExpoEventResourcesv0
    | ExpoEventFleetv0
    | ExpoEventItemv0
    | ExpoEventEarlyv0
    | ExpoEventDelayv0
    | ExpoEventTraderv0
    | ExpoEventLostFleetv0
    | ExpoEventNothingv0
    | ExpoEventPiratesv0
    | ExpoEventAliensv0;
export default ExpoEventv0;