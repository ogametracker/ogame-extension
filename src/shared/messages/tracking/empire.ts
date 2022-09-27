import { Coordinates } from '../../models/ogame/common/Coordinates';
import { Message, NoDataMessage } from '../../messages/Message';
import { MessageType } from '../MessageType';
import { ItemHash } from '../../models/ogame/items/ItemHash';
import { NonStationaryShipType, ShipType } from '../../models/ogame/ships/ShipType';
import { DefenseType } from '../../models/ogame/defenses/DefenseType';
import { PlayerOfficers } from '../../models/empire/PlayerOfficers';
import { PlayerClass } from '../../models/ogame/classes/PlayerClass';
import { AllianceClass } from '../../models/ogame/classes/AllianceClass';
import { BuildingType } from '../../models/ogame/buildings/BuildingType';
import { ResearchType } from '../../models/ogame/research/ResearchType';
import { ProductionSettings } from '@/shared/models/empire/ProductionSettings';
import { PlanetActiveItems } from '@/shared/models/empire/PlanetActiveItems';
import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
import { LifeformBuildingType } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { FleetMissionType } from '@/shared/models/ogame/fleets/FleetMissionType';
import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
import { Fleets } from '@/shared/models/ogame/fleets/types';
import { MissileType } from '@/shared/models/ogame/missiles/MissileType';


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
    isMoon: boolean;
    data: T;
}

// active items
export type UpdatePlanetActiveItemsMessage = Message<MessageType.UpdatePlanetActiveItems, PlanetDataWrapper<PlanetActiveItems>>;

// research levels
type ResearchLevels = Partial<Record<ResearchType, number>>;
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

// missile counts
export type PlanetMissileCounts = Record<MissileType, number>;
export type UpdatePlanetMissileCountsMessage = Message<MessageType.UpdatePlanetMissileCounts, PlanetDataWrapper<PlanetMissileCounts>>;

// active officers, player class, alliance class
export type UpdateActiveOfficersMessage = Message<MessageType.UpdateActiveOfficers, PlayerOfficers>;
export type UpdatePlayerClassMessage = Message<MessageType.UpdatePlayerClass, PlayerClass>;
export type UpdateAllianceClassMessage = Message<MessageType.UpdateAllianceClass, AllianceClass>;


// production percentages
export type UpdatePlanetProductionSettingsMessage = Message<MessageType.UpdatePlanetProductionSettings, PlanetDataWrapper<ProductionSettings>>;

// player and universe name
export type UpdatePlayerNameMessage = Message<MessageType.UpdatePlayerName, string>;
export type UpdateUniverseNameMessage = Message<MessageType.UpdateUniverseName, string>;


// lifeforms
export type UpdateSelectedLifeformMessage = Message<MessageType.UpdateSelectedLifeform, PlanetDataWrapper<LifeformType>>;

type LifeformExperience = Partial<Record<LifeformType, number>>;
export type UpdateLifeformExperienceMessage = Message<MessageType.UpdateLifeformExperience, LifeformExperience>;

type PlanetActiveLifeformBuildingLevels = Partial<Record<LifeformBuildingType, number>>;
export type UpdatePlanetActiveLifeformBuildingLevelsMessage = Message<MessageType.UpdatePlanetActiveLifeformBuildingLevels, PlanetDataWrapper<PlanetActiveLifeformBuildingLevels>>;

type PlanetLifeformBuildingLevels = Record<LifeformBuildingType, number>;
export type UpdatePlanetLifeformBuildingLevelsMessage = Message<MessageType.UpdatePlanetLifeformBuildingLevels, PlanetDataWrapper<PlanetLifeformBuildingLevels>>;

type PlanetActiveLifeformTechnologyLevels = Partial<Record<LifeformTechnologyType, number>>;
export type UpdatePlanetActiveLifeformTechnologyLevelsMessage = Message<MessageType.UpdatePlanetActiveLifeformTechnologyLevels, PlanetDataWrapper<PlanetActiveLifeformTechnologyLevels>>;

type PlanetLifeformTechnologyLevels = Record<LifeformTechnologyType, number>;
export type UpdatePlanetLifeformTechnologyLevelsMessage = Message<MessageType.UpdatePlanetLifeformTechnologyLevels, PlanetDataWrapper<PlanetLifeformTechnologyLevels>>;


// fleets
export type UpdateFleetsMessage = Message<MessageType.UpdateFleets, Fleets>;


// notifications
export type NotifyEmpireDataUpdateMessage = NoDataMessage<MessageType.NotifyEmpireDataUpdate>;