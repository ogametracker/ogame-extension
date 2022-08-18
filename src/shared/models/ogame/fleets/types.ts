import { Coordinates } from "../common/Coordinates";
import { FleetMissionType } from "./FleetMissionType";
import { ResourceType } from "../resources/ResourceType";
import { NonStationaryShipType } from "../ships/ShipType";

export interface Fleet {
    id: number;
    mission: FleetMissionType;
    isReturnFlight: boolean;
    arrivalTime: number;
    originCoordinates: Coordinates;
    destinationCoordinates: Coordinates;
    ships: Record<NonStationaryShipType, number>;
    cargo: Record<ResourceType, number>;
}
export type Fleets = Fleet[];