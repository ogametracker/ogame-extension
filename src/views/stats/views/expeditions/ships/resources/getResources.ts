import { ExpeditionFindableShipType } from "@/shared/models/expeditions/ExpeditionEvents";
import { ResourceType } from "@/shared/models/ogame/resources/ResourceType";

// TODO: should use shared model(s)
export function getResources(ship: ExpeditionFindableShipType, count: number): Record<ResourceType, number> {
    let metal = 0;
    let crystal = 0;
    let deuterium = 0;

    switch (ship) {
        case ExpeditionFindableShipType.lightFighter: {
            metal = 3_000;
            crystal = 1_000;
            break;
        }
        case ExpeditionFindableShipType.heavyFighter: {
            metal = 5_000;
            crystal = 4_000;
            break;
        }
        case ExpeditionFindableShipType.cruiser: {
            metal = 20_000;
            crystal = 7_000;
            deuterium = 2_000;
            break;
        }
        case ExpeditionFindableShipType.battleship: {
            metal = 45_000;
            crystal = 15_000;
            break;
        }
        case ExpeditionFindableShipType.battlecruiser: {
            metal = 30_000;
            crystal = 40_000;
            deuterium = 15_000;
            break;
        }
        case ExpeditionFindableShipType.bomber: {
            metal = 50_000;
            crystal = 25_000;
            deuterium = 15_000;
            break;
        }
        case ExpeditionFindableShipType.destroyer: {
            metal = 60_000;
            crystal = 50_000;
            deuterium = 15_000;
            break;
        }
        case ExpeditionFindableShipType.reaper: {
            metal = 85_000;
            crystal = 55_000;
            deuterium = 20_000;
            break;
        }
        case ExpeditionFindableShipType.pathfinder: {
            metal = 8_000;
            crystal = 15_000;
            deuterium = 8_000;
            break;
        }

        case ExpeditionFindableShipType.smallCargo: {
            metal = 2_000;
            crystal = 2_000;
            break;
        }
        case ExpeditionFindableShipType.largeCargo: {
            metal = 6_000;
            crystal = 6_000;
            break;
        }
        case ExpeditionFindableShipType.espionageProbe: {
            crystal = 1_000;
            break;
        }
    }

    return {
        [ResourceType.metal]: metal * count,
        [ResourceType.crystal]: crystal * count,
        [ResourceType.deuterium]: deuterium * count,
    };
}