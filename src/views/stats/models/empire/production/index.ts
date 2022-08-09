import { PlanetData } from "@/shared/models/empire/PlanetData";
import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { CrystalMine } from "@/shared/models/ogame/buildings/CrystalMine";
import { DeuteriumSynthesizer } from "@/shared/models/ogame/buildings/DeuteriumSynthesizer";
import { FusionReactor } from "@/shared/models/ogame/buildings/FusionReactor";
import { MetalMine } from "@/shared/models/ogame/buildings/MetalMine";
import { ProductionBuildingDependencies } from "@/shared/models/ogame/buildings/ProductionBuilding";
import { addCost, Cost } from "@/shared/models/ogame/common/Cost";
import { LifeformTechnologyBonusLifeformBuildingsByLifeform, ResourceProductionBonusLifeformBuildingsByLifeform } from "@/shared/models/ogame/lifeforms/buildings/LifeformBuildings";
import { getLifeformTechnologyBonus } from "@/shared/models/ogame/lifeforms/experience";
import { LifeformType, LifeformTypes } from "@/shared/models/ogame/lifeforms/LifeformType";
import { CollectorClassBonusLifeformTechnologies, CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies, ResourceProductionBonusLifeformTechnologies } from "@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies";
import { hasCommandStaff } from "@/shared/models/ogame/premium/hasCommandStaff";
import { ResearchType } from "@/shared/models/ogame/research/ResearchType";
import { getCrystalBaseProduction } from "@/shared/models/ogame/resource-production/getCrystalProduction";
import { getItemBonus } from "@/shared/models/ogame/resource-production/getItemBonus";
import { getMetalBaseProduction } from "@/shared/models/ogame/resource-production/getMetalProduction";
import { EmpireProductionBreakdown, EmpireProductionPlanetState } from "@/shared/models/ogame/resource-production/types";
import { ResourceType } from "@/shared/models/ogame/resources/ResourceType";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { createRecord } from "@/shared/utils/createRecord";
import { EmpireDataModule } from "@/views/stats/data/EmpireDataModule";
import { ServerSettingsDataModule } from "@/views/stats/data/ServerSettingsDataModule";

export interface EmpireProductionBreakdowns extends Record<ResourceType, EmpireProductionBreakdown> {
    getTotal(): Cost;
}

function get_planetCollectorClassBonusFactor(planet: PlanetData) {
    return CollectorClassBonusLifeformTechnologies
        .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
        .reduce(
            (total, tech) => total + tech.getCollectorClassBonus(planet.lifeformTechnologies[tech.type]),
            0
        );
}

function get_planetLifeformTechnologyBoost(planet: PlanetData) {
    return LifeformTechnologyBonusLifeformBuildingsByLifeform[planet.activeLifeform]
        .reduce(
            (total, building) => total + building.getLifeformTechnologyBonus(planet.lifeformBuildings[building.type]),
            0
        );
}

function get_planetLifeformTechnologyCrawlerProductionBonusFactor(planet: PlanetData) {
    return CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies
        .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
        .reduce(
            (total, tech) => total + tech.getCrawlerProductionBonus(planet.lifeformTechnologies[tech.type]),
            0
        );
}

function get_planetLifeformBuildingBonusProductionFactor(planet: PlanetData): Cost {
    return ResourceProductionBonusLifeformBuildingsByLifeform[planet.activeLifeform].reduce<Cost>(
        (total, building) => addCost(total, building.getProductionBonus(planet.lifeformBuildings[building.type])),
        { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    );
}

function get_planetLifeformTechnologyBonusProductionFactor(planet: PlanetData): Cost {
    return ResourceProductionBonusLifeformTechnologies
        .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
        .reduce<Cost>(
            (total, tech) => addCost(total, tech.getProductionBonus(planet.lifeformTechnologies[tech.type])),
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );
}

export function getProductionBreakdowns(): EmpireProductionBreakdowns {
    const planets = Object.values(EmpireDataModule.empire.planets)
        .filter(planet => !planet.isMoon) as PlanetData[];

    const empire = EmpireDataModule.empire;
    const lifeformExperience = EmpireDataModule.lifeformExperience;
    const plasmaTechLevel = empire.research[ResearchType.plasmaTechnology];

    const serverSettings = ServerSettingsDataModule.serverSettings;
    const productionServerSettings = {
        collectorProductionFactor: serverSettings.playerClasses.collector.productionFactorBonus,
        geologistActiveCrawlerFactorBonus: serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
        collectorCrawlerProductionFactorBonus: serverSettings.playerClasses.collector.crawlers.productionFactorBonus,
        crawlerProductionFactorPerUnit: serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit,
        crawlerMaxProductionFactor: serverSettings.playerClasses.crawlers.maxProductionFactor,
    };

    const empireProductionPlanetStates = {
        metal: {} as Record<number, EmpireProductionPlanetState>,
        crystal: {} as Record<number, EmpireProductionPlanetState>,
        deuterium: {} as Record<number, EmpireProductionPlanetState>,
    };
    const lifeformXpBoost = createRecord(LifeformTypes, lf => lf == LifeformType.none ? 0 : getLifeformTechnologyBonus(lifeformExperience[lf]));

    planets.forEach(planet => {
        const levelMetalMine = planet.buildings[BuildingType.metalMine];
        const levelCrystalMine = planet.buildings[BuildingType.crystalMine];
        const levelDeuteriumSynthesizer = planet.buildings[BuildingType.deuteriumSynthesizer];
        const totalMineLevel = levelMetalMine + levelCrystalMine + levelDeuteriumSynthesizer;

        const levelFusionReactor = planet.buildings[BuildingType.fusionReactor];

        const crawlerConfig = {
            available: planet.ships[ShipType.crawler],
            percentage: planet.productionSettings[ShipType.crawler],
            totalMineLevel,
        };

        const baseProductionConfig = {
            crawlers: crawlerConfig,
            lifeformExperienceBoost: lifeformXpBoost[planet.activeLifeform],
            collectorClassBonusFactor: get_planetCollectorClassBonusFactor(planet),
            lifeformBuildingBonusProductionFactor: get_planetLifeformBuildingBonusProductionFactor(planet),
            lifeformTechnologyBonusProductionFactor: get_planetLifeformTechnologyBonusProductionFactor(planet),
            lifeformTechnologyCrawlerProductionBonusFactor: get_planetLifeformTechnologyCrawlerProductionBonusFactor(planet),
            lifeformTechnologyBoost: get_planetLifeformTechnologyBoost(planet),
        };

        const productionBuildingDependencies: ProductionBuildingDependencies = {
            planet: {
                position: planet.coordinates.position,
                temperature: planet.maxTemperature,
            },
            serverSettings: {
                economySpeed: serverSettings.speed.economy,
                crystalBoost: {
                    default: serverSettings.resourceProduction.productionFactorBonus.crystal.default,
                    pos1: serverSettings.resourceProduction.productionFactorBonus.crystal.pos1,
                    pos2: serverSettings.resourceProduction.productionFactorBonus.crystal.pos2,
                    pos3: serverSettings.resourceProduction.productionFactorBonus.crystal.pos3,
                },
            },
            productionSettings: {
                metalMine: planet.productionSettings[BuildingType.metalMine],
                crystalMine: planet.productionSettings[BuildingType.crystalMine],
                deuteriumSynthesizer: planet.productionSettings[BuildingType.deuteriumSynthesizer],
                fusionReactor: planet.productionSettings[BuildingType.fusionReactor],
            },
        };


        empireProductionPlanetStates.metal[planet.id] = {
            baseProduction: getMetalBaseProduction({
                planetPosition: planet.coordinates.position,
                serverEconomySpeed: serverSettings.speed.economy,
            }),
            mineProduction: MetalMine.getProduction(levelMetalMine, productionBuildingDependencies),
            itemBonusProductionFactor: getItemBonus(ResourceType.metal, planet.activeItems),
            ...baseProductionConfig,
            lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.metal,
            lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.metal,
            fusionReactorConsumption: 0,
        };

        empireProductionPlanetStates.crystal[planet.id] = {
            baseProduction: getCrystalBaseProduction({
                planetPosition: planet.coordinates.position,
                serverEconomySpeed: serverSettings.speed.economy,
                serverPositionBoost: serverSettings.resourceProduction.productionFactorBonus.crystal,
            }),
            mineProduction: CrystalMine.getProduction(levelCrystalMine, productionBuildingDependencies),
            itemBonusProductionFactor: getItemBonus(ResourceType.crystal, planet.activeItems),
            ...baseProductionConfig,
            lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.crystal,
            lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.crystal,
            fusionReactorConsumption: 0,
        };

        empireProductionPlanetStates.deuterium[planet.id] = {
            baseProduction: 0,
            mineProduction: DeuteriumSynthesizer.getProduction(levelDeuteriumSynthesizer, productionBuildingDependencies),
            itemBonusProductionFactor: getItemBonus(ResourceType.deuterium, planet.activeItems),
            ...baseProductionConfig,
            lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.deuterium,
            lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.deuterium,
            fusionReactorConsumption: FusionReactor.getConsumption(levelFusionReactor, productionBuildingDependencies).deuterium,
        };
    });

    const empireProductionBreakdowns: EmpireProductionBreakdowns = {
        metal: new EmpireProductionBreakdown(
            ResourceType.metal,
            plasmaTechLevel,
            empire.playerClass,
            empire.allianceClass,
            empire.officers.geologist,
            hasCommandStaff(empire.officers),
            productionServerSettings,
            empireProductionPlanetStates.metal,
        ),
        crystal: new EmpireProductionBreakdown(
            ResourceType.crystal,
            plasmaTechLevel,
            empire.playerClass,
            empire.allianceClass,
            empire.officers.geologist,
            hasCommandStaff(empire.officers),
            productionServerSettings,
            empireProductionPlanetStates.crystal,
        ),
        deuterium: new EmpireProductionBreakdown(
            ResourceType.deuterium,
            plasmaTechLevel,
            empire.playerClass,
            empire.allianceClass,
            empire.officers.geologist,
            hasCommandStaff(empire.officers),
            productionServerSettings,
            empireProductionPlanetStates.deuterium,
        ),

        getTotal(includeConsumption = false): Cost {
            return {
                metal: this.metal.getTotal(includeConsumption),
                crystal: this.crystal.getTotal(includeConsumption),
                deuterium: this.deuterium.getTotal(includeConsumption),
                energy: 0,
            };
        },
    };

    return empireProductionBreakdowns;
}