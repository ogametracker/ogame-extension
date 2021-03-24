import ExpoEventCollection from "@/models/expeditions/ExpoEventCollection";
import ExpoEventv0, { ExpoEventNothingv0, ExpoEventResourcesv0, ExpoEventFleetv0, ExpoEventAliensv0, ExpoEventPiratesv0, ExpoEventDarkMatterv0, ExpoEventDelayv0, ExpoEventEarlyv0, ExpoEventItemv0, ExpoEventLostFleetv0, ExpoEventTraderv0 } from "@/models/v0/ExpoEvent";
import ExpoEventCollectionv0 from "@/models/v0/ExpoEventCollection";
import ExpoTypev0 from "@/models/v0/ExpoType";
import ExpoEvent, { ExpoEventNothing, ExpoEventResources, ExpoEventFleet, ExpoEventAliens, ExpoEventPirates, ExpoEventDarkMatter, ExpoEventDelay, ExpoEventEarly, ExpoEventItem, ExpoEventLostFleet, ExpoEventTrader } from '@/models/expeditions/ExpoEvent';
import ExpoType from "@/models/expeditions/ExpoType";
import ExpoSize from "@/models/expeditions/ExpoSize";

function migrateExpo_v0_v1(expoEvent: ExpoEventv0): ExpoEvent {
    switch (expoEvent.type) {

        case ExpoTypev0.nothing: {
            const oldExpo: ExpoEventNothingv0 = expoEvent;
        
            return {
                type: ExpoType.nothing,
                date: oldExpo.date,
                id: oldExpo.id,
            } as ExpoEventNothing;
        }

        case ExpoTypev0.resources: {
            const oldExpo: ExpoEventResourcesv0 = expoEvent;
        
            return {
                type: ExpoType.resources,
                date: oldExpo.date,
                id: oldExpo.id,
                size: oldExpo.size as string as ExpoSize,
                resources: {
                    metal: oldExpo.resources.metal,
                    crystal: oldExpo.resources.crystal,
                    deuterium: oldExpo.resources.deuterium,
                }
            } as ExpoEventResources;
        }

        case ExpoTypev0.fleet: {
            const oldExpo: ExpoEventFleetv0 = expoEvent;
        
            return {
                type: ExpoType.fleet,
                date: oldExpo.date,
                id: oldExpo.id,
                size: oldExpo.size as string as ExpoSize,
                fleet: {
                    lightFighter: oldExpo.fleet["Leichter Jäger"] ?? 0,
                    heavyFighter: oldExpo.fleet["Schwerer Jäger"] ?? 0,
                    cruiser: oldExpo.fleet.Kreuzer ?? 0,
                    battleship: oldExpo.fleet.Schlachtschiff ?? 0,
                    battlecruiser: oldExpo.fleet.Schlachtkreuzer ?? 0,
                    bomber: oldExpo.fleet.Bomber ?? 0,
                    destroyer: oldExpo.fleet.Zerstörer ?? 0,
                    espionageProbe: oldExpo.fleet.Spionagesonde ?? 0,
                    largeCargo: oldExpo.fleet["Großer Transporter"] ?? 0,
                    pathfinder: oldExpo.fleet.Pathfinder ?? 0,
                    reaper: oldExpo.fleet.Reaper ?? 0,
                    smallCargo: oldExpo.fleet["Kleiner Transporter"] ?? 0,
                }
            } as ExpoEventFleet;
        }

        case ExpoTypev0.aliens: {
            const oldExpo: ExpoEventAliensv0 = expoEvent;
        
            return {
                type: ExpoType.aliens,
                date: oldExpo.date,
                id: oldExpo.id,
                size: oldExpo.size as string as ExpoSize
            } as ExpoEventAliens;
        }

        case ExpoTypev0.pirates: {
            const oldExpo: ExpoEventPiratesv0 = expoEvent;
        
            return {
                type: ExpoType.pirates,
                date: oldExpo.date,
                id: oldExpo.id,
                size: oldExpo.size as string as ExpoSize
            } as ExpoEventPirates;
        }

        case ExpoTypev0.darkMatter: {
            const oldExpo: ExpoEventDarkMatterv0 = expoEvent;
        
            return {
                type: ExpoType.darkMatter,
                date: oldExpo.date,
                id: oldExpo.id,
                size: oldExpo.size as string as ExpoSize,
                darkMatter: oldExpo.darkMatter,
            } as ExpoEventDarkMatter;
        }

        case ExpoTypev0.delay: {
            const oldExpo: ExpoEventDelayv0 = expoEvent;
        
            return {
                type: ExpoType.delay,
                date: oldExpo.date,
                id: oldExpo.id,
            } as ExpoEventDelay;
        }

        case ExpoTypev0.early: {
            const oldExpo: ExpoEventEarlyv0 = expoEvent;
        
            return {
                type: ExpoType.early,
                date: oldExpo.date,
                id: oldExpo.id,
            } as ExpoEventEarly;
        }

        case ExpoTypev0.item: {
            const oldExpo: ExpoEventItemv0 = expoEvent;
        
            return {
                type: ExpoType.item,
                date: oldExpo.date,
                id: oldExpo.id,
                itemHash: oldExpo.item.hash,
            } as ExpoEventItem;
        }

        case ExpoTypev0.lostFleet: {
            const oldExpo: ExpoEventLostFleetv0 = expoEvent;
        
            return {
                type: ExpoType.lostFleet,
                date: oldExpo.date,
                id: oldExpo.id,
            } as ExpoEventLostFleet;
        }

        case ExpoTypev0.trader: {
            const oldExpo: ExpoEventTraderv0 = expoEvent;
        
            return {
                type: ExpoType.trader,
                date: oldExpo.date,
                id: oldExpo.id,
            } as ExpoEventTrader;
        }
    }

    throw new Error();
}

/**
 * Migrates the tracked data from the v0 to the v1 format
 */
export function migrateExpos_v0_v1(exposv0: ExpoEventCollectionv0): ExpoEventCollection {
    const result: ExpoEventCollection = {};

    const expoIds = Object.keys(exposv0).map(parseInt);
    for (const expoId of expoIds) {
        result[expoId] = migrateExpo_v0_v1(exposv0[expoId]);
    }

    return result;
}