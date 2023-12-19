import { createRecord } from "@/shared/utils/createRecord";
import { ExpeditionEventTypes } from "../../expeditions/ExpeditionEventType";
import { PlayerClass } from "../../ogame/classes/PlayerClass";
import { AmortizationPlanetState } from "./AmortizationItemGenerator";
import { AmortizationExpeditionResultsPlanetState } from "./AmortizationExpeditionResultsBreakdown";
import { Cost, addCost } from "../../ogame/common/Cost";
import { AmortizationPlanetSettings } from "./AmortizationPlanetSettings";
import { BuildingType } from "../../ogame/buildings/BuildingType";
import { ProductionBuildingDependencies } from "../../ogame/buildings/ProductionBuilding";
import { Coordinates } from "../../ogame/common/Coordinates";
import { ItemHash } from "../../ogame/items/ItemHash";
import { LifeformBuildingTypes } from "../../ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyTypes } from "../../ogame/lifeforms/LifeformTechnologyType";
import { ValidLifeformType, LifeformType } from "../../ogame/lifeforms/LifeformType";
import { ResourceProductionBonusLifeformBuildingsByLifeform, AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform, LifeformTechnologyResearchBuildingsByLifeform, LifeformTechnologyBonusLifeformBuildingsByLifeform, LifeformTechnologyResearchBuildings } from "../../ogame/lifeforms/buildings/LifeformBuildings";
import { getLifeformLevelTechnologyBonus } from "../../ogame/lifeforms/experience";
import { ResearchCostAndTimeReductionLifeformTechnologies, ClassBonusLifeformTechnologies, CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies, ResourceProductionBonusLifeformTechnologies, ExpeditionBonusLifeformTechnologies } from "../../ogame/lifeforms/technologies/LifeformTechnologies";
import { MissileType } from "../../ogame/missiles/MissileType";
import { ResearchType } from "../../ogame/research/ResearchType";
import { ShipType } from "../../ogame/ships/ShipType";
import { ServerSettings } from "../../server-settings/ServerSettings";
import { DefenseCount } from "../DefenseCount";
import { PlanetBuildingLevels } from "../PlanetBuildingLevels";
import { PlanetData } from "../PlanetData";
import { PlanetShipCount } from "../PlanetShipCount";
import { ProductionSettings } from "../ProductionSettings";
import { MineBuildingType } from "./models";


export const $mineBuildingTypes: MineBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];

export function getPlanetExpeditionState(planetState: AmortizationPlanetState): AmortizationExpeditionResultsPlanetState {
    const state: AmortizationExpeditionResultsPlanetState = {
        id: planetState.data.id,
        lifeformExperienceBoost: planetState.lifeformExperienceBoost,
        lifeformTechnologyBoost: planetState.lifeformTechnologyBoost,
        discovererClassBonusFactor: getPlanetDiscovererClassBonusFactor(planetState),
        lifeformTechnologyExpeditionBonusFactor: getLifeformTechnologyExpeditionBonusFactor(planetState),
    };
    return state;
}

export function getPlanetDiscovererClassBonusFactor(planetState: AmortizationPlanetState) {
    return planetState.discovererClassBonusTechnologies.reduce(
        (total, tech) => total + tech.getClassBonus(PlayerClass.discoverer, planetState.data.lifeformTechnologies[tech.type] ?? 0),
        0
    );
}

export function getLifeformTechnologyExpeditionBonusFactor(planetState: AmortizationPlanetState) {
    return createRecord(
        ExpeditionEventTypes,
        eventType => planetState.lifeformExpeditionBonusTechnologies.reduce(
            (total, tech) => total + tech.getExpeditionBonus(eventType, planetState.data.lifeformTechnologies[tech.type] ?? 0),
            0
        )
    );
}

export function getPlanetLifeformTechnologyBoost(planetState: AmortizationPlanetState) {
    return planetState.lifeformTechnologyBoostBuildings.reduce(
        (total, building) => total + building.getLifeformTechnologyBonus(planetState.data.lifeformBuildings[building.type]),
        0
    );
}
export function getPlanetCollectorClassBonusFactor(planetState: AmortizationPlanetState) {
    return planetState.collectorClassBonusTechnologies.reduce(
        (total, tech) => total + tech.getClassBonus(PlayerClass.collector, planetState.data.lifeformTechnologies[tech.type] ?? 0),
        0
    );
}
export function getPlanetLifeformTechnologyCrawlerProductionBonusFactor(planetState: AmortizationPlanetState) {
    return planetState.crawlerProductionBonusTechnologies.reduce(
        (total, tech) => total + tech.getCrawlerProductionBonus(planetState.data.lifeformTechnologies[tech.type]),
        0
    );
}
export function getPlanetLifeformBuildingBonusProductionFactor(planetState: AmortizationPlanetState): Cost {
    return planetState.lifeformResourceProductionBonusBuildings.reduce<Cost>(
        (total, building) => addCost(total, building.getProductionBonus(planetState.data.lifeformBuildings[building.type])),
        { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    );
}
export function getPlanetLifeformTechnologyBonusProductionFactor(planetState: AmortizationPlanetState): Cost {
    return planetState.lifeformResourceProductionBonusTechnologies.reduce<Cost>(
        (total, tech) => addCost(total, tech.getProductionBonus(planetState.data.lifeformTechnologies[tech.type])),
        { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    );
}


export function getPlanetState(planet: AmortizationPlanetSettings, serverSettings: ServerSettings, lifeformExperience: Record<ValidLifeformType, number>): AmortizationPlanetState {
    const planetData = getPlanetData(planet);

    const lifeformResourceProductionBonusBuildings = ResourceProductionBonusLifeformBuildingsByLifeform[planet.lifeform];

    // lf building cost reduction
    const lifeformBuildingCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform]
        .filter(b => LifeformBuildingTypes.some(lfBuildingType => b.getCostAndTimeReduction(lfBuildingType, 20).cost > 0));

    // mine cost reduction
    const mineCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform]
        .filter(b => $mineBuildingTypes.some(mineType => b.getCostAndTimeReduction(mineType, 20).cost > 0));

    // plasma tech cost reduction
    const plasmaTechnologyCostReductionTechnologies = ResearchCostAndTimeReductionLifeformTechnologies.filter(
        tech => planet.activeLifeformTechnologies.includes(tech.type)
            && tech.getResearchCostAndTimeReduction(ResearchType.plasmaTechnology, 20).cost > 0
    );

    // lf research buildings
    const lifeformTechnologyResearchBuildings = LifeformTechnologyResearchBuildingsByLifeform[planet.lifeform];

    // collector class bonuses
    const collectorClassBonusTechnologies = ClassBonusLifeformTechnologies.filter(
        tech => tech.appliesTo(PlayerClass.collector) && planet.activeLifeformTechnologies.includes(tech.type)
    );

    // crawler bonuses
    const crawlerProductionBonusTechnologies = CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies.filter(
        tech => planet.activeLifeformTechnologies.includes(tech.type)
    );

    // production bonuses
    const lifeformResourceProductionBonusTechnologies = ResourceProductionBonusLifeformTechnologies.filter(
        tech => planet.activeLifeformTechnologies.includes(tech.type)
    );

    // technology bonus buildings
    const lifeformTechnologyBoostBuildings = LifeformTechnologyBonusLifeformBuildingsByLifeform[planet.lifeform];

    // init mine cost reductions
    const mineCostReductions = createRecord(
        $mineBuildingTypes,
        mineType => mineCostReductionBuildings.reduce(
            (total, building) => total + building.getCostAndTimeReduction(mineType, planetData.lifeformBuildings[building.type]).cost,
            0,
        ),
    );
    // init lf building cost reductions
    const lifeformBuildingCostReductions = createRecord(
        LifeformBuildingTypes,
        mineType => lifeformBuildingCostReductionBuildings.reduce(
            (total, building) => total + building.getCostAndTimeReduction(mineType, planetData.lifeformBuildings[building.type]).cost,
            0,
        ),
    );
    // init lf tech cost reductions
    const lifeformTechnologyCostReduction = lifeformTechnologyResearchBuildings.reduce(
        (total, building) => total + building.getLifeformTechnologyResearchCostAndTimeReduction(planetData.lifeformBuildings[building.type]).cost,
        0,
    );
    // init plasmatech cost reductions
    const plasmaTechnologyCostReduction = plasmaTechnologyCostReductionTechnologies.reduce(
        (total, tech) => total + tech.getResearchCostAndTimeReduction(ResearchType.plasmaTechnology, planetData.lifeformTechnologies[tech.type]).cost,
        0,
    );

    // init lifeform technology boost
    const lifeformTechnologyBoost = lifeformTechnologyBoostBuildings.reduce(
        (total, boostBuilding) => total + boostBuilding.getLifeformTechnologyBonus(planetData.lifeformBuildings[boostBuilding.type]),
        0,
    );

    // init discoverer bonus
    const discovererClassBonusTechnologies = ClassBonusLifeformTechnologies.filter(
        tech => tech.appliesTo(PlayerClass.discoverer) && planet.activeLifeformTechnologies.includes(tech.type)
    );
    // init expedition find bonus researches
    const lifeformExpeditionBonusTechnologies = ExpeditionBonusLifeformTechnologies.filter(
        tech => planet.activeLifeformTechnologies.includes(tech.type)
    );

    const productionBuildingDependencies: ProductionBuildingDependencies = {
        planet: {
            position: planetData.coordinates.position,
            temperature: planetData.maxTemperature,
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
            metalMine: planetData.productionSettings[BuildingType.metalMine],
            crystalMine: planetData.productionSettings[BuildingType.crystalMine],
            deuteriumSynthesizer: planetData.productionSettings[BuildingType.deuteriumSynthesizer],
            fusionReactor: 0,
        },
    };

    const lifeformExperienceBoost = planet.lifeform == LifeformType.none
        ? 0
        : getLifeformLevelTechnologyBonus(lifeformExperience[planet.lifeform]);

    return {
        data: planetData,

        lifeformExperienceBoost,
        lifeformTechnologyBoost,

        productionBuildingDependencies,

        mineCostReductionBuildings,
        lifeformBuildingCostReductionBuildings,
        lifeformTechnologyResearchBuildings,
        lifeformTechnologyBoostBuildings,
        lifeformResourceProductionBonusBuildings,

        collectorClassBonusTechnologies,
        plasmaTechnologyCostReductionTechnologies,
        crawlerProductionBonusTechnologies,
        lifeformResourceProductionBonusTechnologies,

        mineCostReductions,
        lifeformBuildingCostReductions,
        lifeformTechnologyCostReduction,
        plasmaTechnologyCostReduction,

        discovererClassBonusTechnologies,
        lifeformExpeditionBonusTechnologies,
    };
}
export function getPlanetData(planet: AmortizationPlanetSettings): PlanetData {
    return {
        id: planet.id,
        isMoon: false,
        name: planet.name,
        activeItems: planet.activeItems.reduce(
            (acc, item) => {
                acc[item] = 'permanent';
                return acc;
            },
            {} as Partial<Record<ItemHash, 'permanent'>>
        ),
        activeLifeform: planet.lifeform,
        activeLifeformTechnologies: [...planet.activeLifeformTechnologies],
        buildings: {
            [BuildingType.metalMine]: planet.mines?.metalMine ?? 0,
            [BuildingType.crystalMine]: planet.mines?.crystalMine ?? 0,
            [BuildingType.deuteriumSynthesizer]: planet.mines?.deuteriumSynthesizer ?? 0,
        } as PlanetBuildingLevels,
        coordinates: { position: planet.position } as Coordinates,
        defense: {} as DefenseCount,
        missiles: {} as Record<MissileType, number>,
        lifeformBuildings: {
            ...(planet.lifeformBuildingLevels ?? createRecord(LifeformBuildingTypes, 0)),
            ...(createRecord(
                LifeformTechnologyResearchBuildings.map(b => b.type),
                b => Math.max(1, planet.lifeformBuildingLevels?.[b] ?? 0) // assume at least level 1 for lf research buildings
            )),
        },
        lifeformTechnologies: { ...(planet.lifeformTechnologyLevels ?? createRecord(LifeformTechnologyTypes, 0)) },
        maxTemperature: planet.maxTemperature,
        productionSettings: {
            [BuildingType.metalMine]: 100,
            [BuildingType.crystalMine]: 100,
            [BuildingType.deuteriumSynthesizer]: 100,
            [ShipType.crawler]: planet.crawlers.percentage,
        } as ProductionSettings,
        ships: {
            [ShipType.crawler]: planet.crawlers.max ? 10000 : planet.crawlers.count,
        } as PlanetShipCount,
    };
}