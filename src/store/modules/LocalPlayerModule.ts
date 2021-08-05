import Building from "@/models/Building";
import Coordinates from "@/models/Coordinates";
import { Defense } from "@/models/Defense";
import { ItemHash } from "@/models/items";
import OgameMetaData from "@/models/ogame/OgameMetaData";
import Research from "@/models/Research";
import Ship from "@/models/Ship";
import asyncChromeStorage from "@/utils/asyncChromeStorage";
import Vue from "vue";
import Component from "vue-class-component";

export interface PlanetDataBase {
    id: number;
    name: string;
    coordinates: Coordinates;

    defense: DefenseCount;
    activeItems: Partial<Record<ItemHash, number | undefined>>;
}

export interface PlanetData extends PlanetDataBase {
    isMoon: false;
    maxTemperature: number;
    buildings: PlanetBuildingLevels;
    ships: PlanetShipCount;

    productionSettings: ProductionSettings;
}

export type ProductionPercentage = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
export type CrawlerProductionPercentage = ProductionPercentage | 110 | 120 | 130 | 140 | 150;

export interface ProductionSettings {
    [Building.metalMine]: ProductionPercentage;
    [Building.crystalMine]: ProductionPercentage;
    [Building.deuteriumSynthesizer]: ProductionPercentage;
    [Building.solarPlant]: ProductionPercentage;
    [Building.fusionReactor]: ProductionPercentage;
    [Ship.solarSatellite]: ProductionPercentage;
    [Ship.crawler]: CrawlerProductionPercentage;
}

export interface MoonData extends PlanetDataBase {
    isMoon: true;
    buildings: MoonBuildingLevels;
    ships: MoonShipCount;
}

export interface PlanetBuildingProductionLevels {
    [Building.metalMine]: number;
    [Building.crystalMine]: number;
    [Building.deuteriumSynthesizer]: number;

    [Building.metalStorage]: number;
    [Building.crystalStorage]: number;
    [Building.deuteriumTank]: number;

    [Building.solarPlant]: number;
    [Building.fusionReactor]: number;
}

export interface PlanetBuildingFacilitiesLevels {
    [Building.roboticsFactory]: number;
    [Building.shipyard]: number;
    [Building.researchLab]: number;
    [Building.allianceDepot]: number;
    [Building.missileSilo]: number;
    [Building.naniteFactory]: number;
    [Building.terraformer]: number;
    [Building.spaceDock]: number;
}

export interface PlanetBuildingLevels {
    production: PlanetBuildingProductionLevels;
    facilities: PlanetBuildingFacilitiesLevels;
}


export interface MoonBuildingProductionLevels {
    [Building.metalStorage]: number;
    [Building.crystalStorage]: number;
    [Building.deuteriumTank]: number;
}

export interface MoonBuildingFacilitiesLevels {
    [Building.roboticsFactory]: number;
    [Building.shipyard]: number;

    [Building.lunarBase]: number;
    [Building.sensorPhalanx]: number;
    [Building.jumpGate]: number;
}

export interface MoonBuildingLevels {
    production: MoonBuildingProductionLevels;
    facilities: MoonBuildingFacilitiesLevels;
}

export interface ResearchLevels {
    [Research.energyTechnology]: number;
    [Research.laserTechnology]: number;
    [Research.ionTechnology]: number;
    [Research.hyperspaceTechnology]: number;
    [Research.plasmaTechnology]: number;

    [Research.combustionDrive]: number;
    [Research.impulseDrive]: number;
    [Research.hyperspaceDrive]: number;

    [Research.espionageTechnology]: number;
    [Research.computerTechnology]: number;
    [Research.astrophysics]: number;
    [Research.intergalacticResearchNetwork]: number;
    [Research.gravitonTechnology]: number;

    [Research.weaponsTechnology]: number;
    [Research.shieldingTechnology]: number;
    [Research.armorTechnology]: number;
}

export interface MoonShipCount {
    [Ship.lightFighter]: number;
    [Ship.heavyFighter]: number;
    [Ship.cruiser]: number;
    [Ship.battleship]: number;
    [Ship.battlecruiser]: number;
    [Ship.bomber]: number;
    [Ship.destroyer]: number;
    [Ship.deathStar]: number;
    [Ship.reaper]: number;
    [Ship.pathfinder]: number;

    [Ship.smallCargo]: number;
    [Ship.largeCargo]: number;
    [Ship.colonyShip]: number;
    [Ship.recycler]: number;
    [Ship.espionageProbe]: number;
    [Ship.solarSatellite]: number;
}

export interface PlanetShipCount extends MoonShipCount {
    [Ship.crawler]: number;
}

export interface DefenseCount {
    [Defense.rocketLauncher]: number;
    [Defense.lightLaser]: number;
    [Defense.heavyLaser]: number;
    [Defense.gaussCannon]: number;
    [Defense.ionCannon]: number;
    [Defense.plasmaTurret]: number;
    [Defense.smallShieldDome]: boolean;
    [Defense.largeShieldDome]: boolean;

    [Defense.ballisticMissile]: number;
    [Defense.interplanetaryMissile]: number;
}

export enum PlayerClass {
    collector = 'collector',
    discoverer = 'discoverer',
    general = 'general',
    none = 'none',
}

export enum AllianceClass {
    trader = 'trader',
    researcher = 'researcher',
    warrior = 'warrior',
    none = 'none',
}

export interface LocalPlayerData {
    planets: Record<number, PlanetData | MoonData>;
    research: ResearchLevels;
    playerClass: PlayerClass;
    allianceClass: AllianceClass;
    officers: PlayerOfficers;
}

export interface PlayerOfficers {
    commander: boolean;
    admiral: boolean;
    geologist: boolean;
    engineer: boolean;
    technocrat: boolean;
}

@Component({})
class LocalPlayerModule extends Vue {
    private defaultData: LocalPlayerData = {
        planets: {},
        research: {
            [Research.energyTechnology]: 0,
            [Research.laserTechnology]: 0,
            [Research.ionTechnology]: 0,
            [Research.hyperspaceTechnology]: 0,
            [Research.plasmaTechnology]: 0,

            [Research.combustionDrive]: 0,
            [Research.impulseDrive]: 0,
            [Research.hyperspaceDrive]: 0,

            [Research.espionageTechnology]: 0,
            [Research.computerTechnology]: 0,
            [Research.astrophysics]: 0,
            [Research.intergalacticResearchNetwork]: 0,
            [Research.gravitonTechnology]: 0,

            [Research.weaponsTechnology]: 0,
            [Research.shieldingTechnology]: 0,
            [Research.armorTechnology]: 0,
        },
        playerClass: PlayerClass.none,
        allianceClass: AllianceClass.none,
        officers: {
            admiral: false,
            commander: false,
            engineer: false,
            geologist: false,
            technocrat: false,
        },
    };

    public async getData(): Promise<LocalPlayerData> {
        const storedData = await asyncChromeStorage.get<LocalPlayerData>(this.storageKey);
        return storedData ?? this.defaultData;
    }

    private get storageKey(): string {
        return `${OgameMetaData.storageKeyPrefix}-local-player`;
    }

    public async save(data: LocalPlayerData) {
        await asyncChromeStorage.set(this.storageKey, data);
    }
}

export default new LocalPlayerModule();