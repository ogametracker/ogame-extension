import type { LocalPlayerData } from '@ogame-tracker/shared/models/empire/LocalPlayerData';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { CrystalMine } from '@ogame-tracker/shared/models/ogame/buildings/CrystalMine';
import { DeuteriumSynthesizer } from '@ogame-tracker/shared/models/ogame/buildings/DeuteriumSynthesizer';
import { FusionReactor } from '@ogame-tracker/shared/models/ogame/buildings/FusionReactor';
import { MetalMine } from '@ogame-tracker/shared/models/ogame/buildings/MetalMine';
import type { ProductionBuildingDependencies } from '@ogame-tracker/shared/models/ogame/buildings/ProductionBuilding';
import type { Cost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { LifeformType, LifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { hasCommandStaff } from '@ogame-tracker/shared/models/ogame/premium/hasCommandStaff';
import { ResearchType } from '@ogame-tracker/shared/models/ogame/research/ResearchType';
import { getCrystalBaseProduction } from '@ogame-tracker/shared/models/ogame/resource-production/getCrystalProduction';
import { getItemBonus } from '@ogame-tracker/shared/models/ogame/resource-production/getItemBonus';
import { getMetalBaseProduction } from '@ogame-tracker/shared/models/ogame/resource-production/getMetalProduction';
import { EmpireProductionBreakdown } from '@ogame-tracker/shared/models/ogame/resource-production/types';
import type { EmpireProductionPlanetState } from '@ogame-tracker/shared/models/ogame/resource-production/types';
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';
import {
    getPlanetCollectorClassBonusFactor,
    getPlanetLifeformBuildingBonusProductionFactor,
    getPlanetLifeformTechnologyBonusProductionFactor,
    getPlanetLifeformTechnologyBoost,
} from '../../lifeforms';

export interface EmpireProductionBreakdowns extends Record<ResourceType, EmpireProductionBreakdown> {
    getTotal(): Cost;
}

function getPlanetLifeformTechnologyCrawlerProductionBonusFactor(planet: PlanetData) {
    return CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies.filter(tech =>
        planet.activeLifeformTechnologies.includes(tech.type),
    ).reduce((total, tech) => total + tech.getCrawlerProductionBonus(planet.lifeformTechnologies[tech.type]), 0);
}

export function getProductionBreakdowns(
    empire: LocalPlayerData,
    lifeformExperience: Record<ValidLifeformType, number>,
): EmpireProductionBreakdowns {
    const planets = Object.values(empire.planets).filter(planet => !planet.isMoon) as PlanetData[];

    const plasmaTechLevel = empire.research[ResearchType.plasmaTechnology];

    const serverSettings = useServerSettingsStore().serverSettings;
    const productionServerSettings = {
        collectorProductionFactor: serverSettings.playerClasses.collector.productionFactorBonus,
        geologistActiveCrawlerFactorBonus:
            serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
        collectorCrawlerProductionFactorBonus: serverSettings.playerClasses.collector.crawlers.productionFactorBonus,
        crawlerProductionFactorPerUnit: serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit,
        crawlerMaxProductionFactor: serverSettings.playerClasses.crawlers.maxProductionFactor,
    };

    const empireProductionPlanetStates = {
        metal: {} as Record<number, EmpireProductionPlanetState>,
        crystal: {} as Record<number, EmpireProductionPlanetState>,
        deuterium: {} as Record<number, EmpireProductionPlanetState>,
    };
    const lifeformXpBoost = createRecord(LifeformTypes, lf =>
        lf == LifeformType.none ? 0 : getLifeformLevelTechnologyBonus(lifeformExperience[lf]),
    );

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
            collectorClassBonusFactor: getPlanetCollectorClassBonusFactor(planet),
            lifeformBuildingBonusProductionFactor: getPlanetLifeformBuildingBonusProductionFactor(planet),
            lifeformTechnologyBonusProductionFactor: getPlanetLifeformTechnologyBonusProductionFactor(planet),
            lifeformTechnologyCrawlerProductionBonusFactor:
                getPlanetLifeformTechnologyCrawlerProductionBonusFactor(planet),
            lifeformTechnologyBoost: getPlanetLifeformTechnologyBoost(planet),
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
            lifeformTechnologyBonusProductionFactor:
                baseProductionConfig.lifeformTechnologyBonusProductionFactor.crystal,
            fusionReactorConsumption: 0,
        };

        empireProductionPlanetStates.deuterium[planet.id] = {
            baseProduction: 0,
            mineProduction: DeuteriumSynthesizer.getProduction(
                levelDeuteriumSynthesizer,
                productionBuildingDependencies,
            ),
            itemBonusProductionFactor: getItemBonus(ResourceType.deuterium, planet.activeItems),
            ...baseProductionConfig,
            lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.deuterium,
            lifeformTechnologyBonusProductionFactor:
                baseProductionConfig.lifeformTechnologyBonusProductionFactor.deuterium,
            fusionReactorConsumption: FusionReactor.getConsumption(levelFusionReactor, productionBuildingDependencies)
                .deuterium,
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
