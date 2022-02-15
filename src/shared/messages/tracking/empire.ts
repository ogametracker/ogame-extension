import { Coordinates } from "../../models/v1/ogame/common/Coordinates";
import { Message, NoDataMessage } from "../../messages/Message";
import { MessageType } from "../MessageType";
import { ItemHash } from "../../models/v1/ogame/items/ItemHash";
import { ShipType } from "../../models/v1/ogame/ships/ShipType";
import { DefenseType } from "../../models/v1/ogame/defenses/DefenseType";
import { PlayerOfficers } from "../../models/v1/empire/PlayerOfficers";
import { PlayerClass } from "../../models/v1/ogame/classes/PlayerClass";
import { AllianceClass } from "../../models/v1/ogame/classes/AllianceClass";
import { BuildingType } from "../../models/v1/ogame/buildings/BuildingType";
import { ResearchType } from "../../models/v1/ogame/research/ResearchType";
import { LocalPlayerData } from "../../models/v1/empire/LocalPlayerData";


// basic planet/moon data
export interface BasicPlanetDataBase {
    id: number;
    name: string;
    coordinates: Coordinates;
}
export interface BasicPlanetDataPlanet extends BasicPlanetDataBase {
    isMoon: false;
    maxTemperature: number;
}
export interface BasicPlanetDataMoon extends BasicPlanetDataBase {
    isMoon: true;
}
export type BasicPlanetData = BasicPlanetDataPlanet | BasicPlanetDataMoon;

export type UpdateOwnedPlanetsMessage = Message<MessageType.UpdatePlanetData, BasicPlanetData[]>;


export interface PlanetDataWrapper<T> {
    planetId: number;
    data: T;
}

// active items
export type UpdatePlanetActiveItemsMessage = Message<MessageType.UpdatePlanetActiveItems, PlanetDataWrapper<Partial<Record<ItemHash, number>>>>;

// research levels
type ResearchLevels = Record<ResearchType, number>;
export type UpdateResearchLevelsMessage = Message<MessageType.UpdateResearchLevels, ResearchLevels>;

// building levels
type PlanetBuildingLevels = Partial<Record<BuildingType, number>>;
export type UpdatePlanetBuildingLevelsMessage = Message<MessageType.UpdatePlanetBuildingLevels, PlanetDataWrapper<PlanetBuildingLevels>>;

// ship counts
type PlanetShipCounts = Partial<Record<ShipType, number>>;
export type UpdatePlanetShipCountsMessage = Message<MessageType.UpdatePlanetShipCounts, PlanetDataWrapper<PlanetShipCounts>>;

// defense counts
export type PlanetDefenseCounts = Record<Exclude<DefenseType, DefenseType.smallShieldDome | DefenseType.largeShieldDome>, number> & { 
    [DefenseType.smallShieldDome]: boolean;
    [DefenseType.largeShieldDome]: boolean;
};
export type UpdatePlanetDefenseCountsMessage = Message<MessageType.UpdatePlanetDefenseCounts, PlanetDataWrapper<PlanetDefenseCounts>>;

// active officers, player class, alliance class
export type UpdateActiveOfficersMessage = Message<MessageType.UpdateActiveOfficers, PlayerOfficers>;
export type UpdatePlayerClassMessage = Message<MessageType.UpdatePlayerClass, PlayerClass>;
export type UpdateAllianceClassMessage = Message<MessageType.UpdateAllianceClass, AllianceClass>;


export type RequestLocalPlayerDataMessage = NoDataMessage<MessageType.RequestEmpireData>;
export type EmpireDataMessage = Message<MessageType.EmpireData, LocalPlayerData>;