import { LifeformType, ValidLifeformType } from "../ogame/lifeforms/LifeformType";
import { LifeformDiscoveryEventType } from "./LifeformDiscoveryEventType";

interface LifeformDiscoveryEventBase {
    id: number;
    date: number;
    type: LifeformDiscoveryEventType;
}

export type LifeformDiscoveryEventNothing = LifeformDiscoveryEventBase & {
    type: LifeformDiscoveryEventType.nothing;
};
export type LifeformDiscoveryEventLostShip = LifeformDiscoveryEventBase & {
    type: LifeformDiscoveryEventType.lostShip;
};
export type LifeformDiscoveryEventNewLifeformFound = LifeformDiscoveryEventBase & {
    type: LifeformDiscoveryEventType.newLifeformFound;
    lifeform: ValidLifeformType;
};
export type LifeformDiscoveryEventKnownLifeformFound = LifeformDiscoveryEventBase & {
    type: LifeformDiscoveryEventType.knownLifeformFound;
    lifeform: ValidLifeformType;
    experience: number;
};

export type LifeformDiscoveryEvent = (
    | LifeformDiscoveryEventNothing
    | LifeformDiscoveryEventLostShip
    | LifeformDiscoveryEventNewLifeformFound
    | LifeformDiscoveryEventKnownLifeformFound
);