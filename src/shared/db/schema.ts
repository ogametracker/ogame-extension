import { DBSchema } from "idb";
import { CombatReport } from "../models/combat-reports/CombatReport";
import { DebrisFieldReport } from "../models/debris-field-reports/DebrisFieldReport";
import { ExpeditionEvent } from "../models/expeditions/ExpeditionEvents";
import { BuildingType, MoonBuildingType, PlanetBuildingType } from "../models/ogame/buildings/BuildingType";
import { AllianceClass } from "../models/ogame/classes/AllianceClass";
import { PlayerClass } from "../models/ogame/classes/PlayerClass";
import { Coordinates } from "../models/ogame/common/Coordinates";
import { DefenseType } from "../models/ogame/defenses/DefenseType";
import { ItemHash } from "../models/ogame/items/ItemHash";
import { ResearchType } from "../models/ogame/research/ResearchType";
import { ShipType } from "../models/ogame/ships/ShipType";
import { Settings } from "../models/settings/Settings";

export interface DbBasicMoonData {
    id: number;
    name: string;
    coordinates: Coordinates;
}

export interface DbBasicPlanetData {
    id: number;
    name: string;
    coordinates: Coordinates;
    maxTemperature: number;
}

export type DbPlanetBuildingLevels = Record<PlanetBuildingType, number>;

export type DbMoonBuildingLevels = Record<MoonBuildingType, number>;

export type DbActiveItems = Partial<Record<ItemHash, number | 'permanent'>>;
export type DbShipAmounts = Record<ShipType, number>;
export type DbDefenseAmounts = Record<Exclude<DefenseType, DefenseType.smallShieldDome | DefenseType.largeShieldDome>, number>
    & Record<DefenseType.smallShieldDome | DefenseType.largeShieldDome, boolean>;

export type DbPlanetProductionSettings = {
    [BuildingType.metalMine]: number;
    [BuildingType.crystalMine]: number;
    [BuildingType.deuteriumSynthesizer]: number;
    [BuildingType.solarPlant]: number;
    [BuildingType.fusionReactor]: number;
    [ShipType.solarSatellite]: number;
    [ShipType.crawler]: number;
};

export type DbPlayerOfficers = {
    commander: boolean;
    admiral: boolean;
    geologist: boolean;
    engineer: boolean;
    technocrat: boolean;
};
export type DbPlayerResearchLevels = Record<ResearchType, number>;
export type DbPlayerPlanetIds = number[];


export interface DbServerSettings {
    _lastUpdate: number;

    name: string;
    number: string;
    language: string;
    timezone: string;
    timezoneOffset: string;
    domain: string;
    version: string;

    speed: number;
    speedFleetPeaceful: number;
    speedFleetWar: number;
    speedFleetHolding: number;
    galaxies: number;
    systems: number;
    acs: number;
    rapidFire: number;
    defToTF: number;
    debrisFactor: number;
    debrisFactorDef: number;
    repairFactor: number;
    newbieProtectionLimit: number;
    newbieProtectionHigh: number;
    topScore: number;
    bonusFields: number;
    donutGalaxy: number;
    donutSystem: number;
    wfEnabled: number;
    wfMinimumRessLost: number;
    wfMinimumLossPercentage: number;
    wfBasicPercentageRepairable: number;
    globalDeuteriumSaveFactor: number;
    bashlimit: number;
    probeCargo: number;
    researchDurationDivisor: number;
    darkMatterNewAcount: number;
    cargoHyperspaceTechMultiplier: number;
    marketplaceEnabled: number;
    marketplaceBasicTradeRatioMetal: number;
    marketplaceBasicTradeRatioCrystal: number;
    marketplaceBasicTradeRatioDeuterium: number;
    marketplacePriceRangeLower: number;
    marketplacePriceRangeUpper: number;
    marketplaceTaxNormalUser: number;
    marketplaceTaxAdmiral: number;
    marketplaceTaxCancelOffer: number;
    marketplaceTaxNotSold: number;
    marketplaceOfferTimeout: number;
    characterClassesEnabled: number;
    minerBonusResourceProduction: number;
    minerBonusFasterTradingShips: number;
    minerBonusIncreasedCargoCapacityForTradingShips: number;
    minerBonusAdditionalFleetSlots: number;
    minerBonusAdditionalMarketSlots: number;
    minerBonusAdditionalCrawler: number;
    minerBonusMaxCrawler: number;
    minerBonusEnergy: number;
    minerBonusOverloadCrawler: number;
    resourceBuggyProductionBoost: number;
    resourceBuggyMaxProductionBoost: number;
    resourceBuggyEnergyConsumptionPerUnit: number;
    warriorBonusFasterCombatShips: number;
    warriorBonusFasterRecyclers: number;
    warriorBonusFuelConsumption: number;
    warriorBonusRecyclerFuelConsumption: number;
    warriorBonusRecyclerCargoCapacity: number;
    warriorBonusAdditionalFleetSlots: number;
    warriorBonusAdditionalMoonFields: number;
    warriorBonusFleetHalfSpeed: number;
    warriorBonusAttackerWreckfield: number;
    combatDebrisFieldLimit: number;
    explorerBonusIncreasedResearchSpeed: number;
    explorerBonusIncreasedExpeditionOutcome: number;
    explorerBonusLargerPlanets: number;
    explorerUnitItemsPerDay: number;
    explorerBonusPhalanxRange: number;
    explorerBonusPlunderInactive: number;
    explorerBonusExpeditionEnemyReduction: number;
    explorerBonusAdditionalExpeditionSlots: number;
    resourceProductionIncreaseCrystalDefault: number;
    resourceProductionIncreaseCrystalPos1: number;
    resourceProductionIncreaseCrystalPos2: number;
    resourceProductionIncreaseCrystalPos3: number;
    exodusRatioMetal: number;
    exodusRatioCrystal: number;
    exodusRatioDeuterium: number;
};
type DbServerSettingsItem<T extends keyof DbServerSettings = keyof DbServerSettings> = {
    key: T;
    value: DbServerSettings[T];
};

export interface OgameTrackerPlayerDbSchema extends DBSchema {
    combatReports: {
        key: number;
        value: CombatReport;
    };

    debrisFieldReports: {
        key: number;
        value: DebrisFieldReport;
    };

    expeditions: {
        key: number;
        value: ExpeditionEvent;
    };

    empire: (
        | { key: 'allianceClass'; value: AllianceClass }
        | { key: 'officers'; value: DbPlayerOfficers }
        | { key: 'playerClass'; value: PlayerClass }
        | { key: 'research'; value: DbPlayerResearchLevels }
        | { key: 'planetOrder'; value: DbPlayerPlanetIds }

        | { key: `planet.${number}`; value: DbBasicPlanetData }
        | { key: `planet.${number}.buildings`; value: DbPlanetBuildingLevels }
        | { key: `planet.${number}.ships`; value: DbShipAmounts }
        | { key: `planet.${number}.defenses`; value: DbDefenseAmounts }
        | { key: `planet.${number}.activeItems`; value: DbActiveItems }
        | { key: `planet.${number}.productionSettings`; value: DbPlanetProductionSettings }

        | { key: `moon.${number}`; value: DbBasicMoonData }
        | { key: `moon.${number}.buildings`; value: DbMoonBuildingLevels }
        | { key: `moon.${number}.ships`; value: DbShipAmounts }
        | { key: `moon.${number}.defenses`; value: DbDefenseAmounts }
        | { key: `moon.${number}.activeItems`; value: DbActiveItems }
    );
};

export interface OgameTrackerServerDbSchema extends DBSchema {
    //TODO: tables for universe history

    serverSettings: DbServerSettingsItem;
}

export interface OgameTrackerGlobalDbSchema extends DBSchema {
    settings: {
        key: 0;
        value: Settings;
    };

    //TODO: table for tracked accounts
    accounts: {
        key: [number, string, number];
        value: {
            serverId: number;
            serverLanguage: string;
            id: number;
            name?: string;
        };
    };

    //TODO: table for known servers
    servers: {
        key: [number, string],
        value: {
            id: number;
            name: string;
            language: string;
        };
    };
}



export const DbVersion = 1;