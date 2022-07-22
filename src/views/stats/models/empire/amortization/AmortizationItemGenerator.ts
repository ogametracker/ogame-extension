import { DefenseCount } from "@/shared/models/empire/DefenseCount";
import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetBuildingLevels } from "@/shared/models/empire/PlanetBuildingLevels";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { PlanetShipCount } from "@/shared/models/empire/PlanetShipCount";
import { ProductionSettings } from "@/shared/models/empire/ProductionSettings";
import { BuildingType } from "@/shared/models/ogame/buildings/BuildingType";
import { CrystalMine } from "@/shared/models/ogame/buildings/CrystalMine";
import { DeuteriumSynthesizer } from "@/shared/models/ogame/buildings/DeuteriumSynthesizer";
import { MetalMine } from "@/shared/models/ogame/buildings/MetalMine";
import { ProductionBuilding, ProductionBuildingDependencies } from "@/shared/models/ogame/buildings/ProductionBuilding";
import { Coordinates } from "@/shared/models/ogame/common/Coordinates";
import { addCost, Cost, multiplyCostInt, subCost } from "@/shared/models/ogame/common/Cost";
import { ItemHash } from "@/shared/models/ogame/items/ItemHash";
import { AnyBuildingCostAndTimeReductionLifeformBuilding, AnyBuildingType } from "@/shared/models/ogame/lifeforms/buildings/interfaces";
import { LifeformBuilding } from "@/shared/models/ogame/lifeforms/buildings/LifeformBuilding";
import { AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform, LifeformTechnologyBonusLifeformBuildings, ResourceProductionBonusLifeformBuildings } from "@/shared/models/ogame/lifeforms/buildings/LifeformBuildings";
import { LifeformBuildingType, LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyTypes } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { LifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { CollectorClassBonusLifeformTechnology, ResearchCostAndTimeReductionLifeformTechnology } from "@/shared/models/ogame/lifeforms/technologies/interfaces";
import { CollectorClassBonusLifeformTechnologies, CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies, ResearchCostAndTimeReductionLifeformTechnologies, ResearchCostAndTimeReductionLifeformTechnologiesByLifeform, ResourceProductionBonusLifeformTechnologies } from "@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies";
import { LifeformTechnology } from "@/shared/models/ogame/lifeforms/technologies/LifeformTechnology";
import { PlasmaTechnology } from "@/shared/models/ogame/research/PlasmaTechnology";
import { ResearchType, ResearchTypes } from "@/shared/models/ogame/research/ResearchType";
import { getCrawlerBoost } from "@/shared/models/ogame/resource-production/getCrawlerBoost";
import { getCrystalProduction } from "@/shared/models/ogame/resource-production/getCrystalProduction";
import { getDeuteriumProduction } from "@/shared/models/ogame/resource-production/getDeuteriumProduction";
import { getMetalProduction } from "@/shared/models/ogame/resource-production/getMetalProduction";
import { ProductionBreakdown, ProductionDependencies } from "@/shared/models/ogame/resource-production/types";
import { ResourceType } from "@/shared/models/ogame/resources/ResourceType";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { ServerSettings } from "@/shared/models/server-settings/ServerSettings";
import { createRecord } from "@/shared/utils/createRecord";
import { AmortizationAstrophysicsSettings } from "./AmortizationAstrophysicsSettings";
import { AmortizationPlanetSettings } from "./AmortizationPlanetSettings";
import { AmortizationPlayerSettings } from "./AmortizationPlayerSettings";
import { AmortizationItem, LifeformBuildingLevels, MineAmortizationItem, MineBuildingType, PlasmaTechnologyAmortizationItem } from "./models";



const $applicableLifeformTechnologyTypes = [
    ...ResourceProductionBonusLifeformTechnologies,
    ...CollectorClassBonusLifeformTechnologies,
    ...CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies,
].map(tech => tech.type);

const $applicableLifeformBuildingTypes = [
    ...ResourceProductionBonusLifeformBuildings,
    ...LifeformTechnologyBonusLifeformBuildings,
].map(b => b.type);
function $getApplicableLifeformBuildingTypesByLifeform(lifeform: LifeformType): LifeformBuildingType[] {
    return $applicableLifeformBuildingTypes.filter(type => LifeformBuildingTypesByLifeform[lifeform].includes(type));
}

const $mineBuildingTypes: MineBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
const $minesByType: Record<MineBuildingType, ProductionBuilding> = {
    [BuildingType.metalMine]: MetalMine,
    [BuildingType.crystalMine]: CrystalMine,
    [BuildingType.deuteriumSynthesizer]: DeuteriumSynthesizer,
};
const $resourceByMineType: Record<MineBuildingType, ResourceType> = {
    [BuildingType.metalMine]: ResourceType.metal,
    [BuildingType.crystalMine]: ResourceType.crystal,
    [BuildingType.deuteriumSynthesizer]: ResourceType.deuterium,
};

interface AmortizationGenerationSettings {
    player: AmortizationPlayerSettings;
    planets: Record<number, AmortizationPlanetSettings>;
    astrophysics: AmortizationAstrophysicsSettings;
    showPlasmaTechnology: boolean;
}
interface ProductionBreakdowns {
    metal: ProductionBreakdown;
    crystal: ProductionBreakdown;
    deuterium: ProductionBreakdown;
}

interface AmortizationPlanetState {
    data: PlanetData;
    productionBreakdowns: ProductionBreakdowns;

    mineCostReductions: Record<MineBuildingType, number>;
    mineCostReductionBuildings: AnyBuildingCostAndTimeReductionLifeformBuilding[];

    lifeformBuildingCostReduction: Record<LifeformBuildingType, number>;
    lifeformBuildingCostReductionBuildings: AnyBuildingCostAndTimeReductionLifeformBuilding[];

    plasmaTechnologyCostReduction: number;
    plasmaTechnologyCostReductionTechnologies: ResearchCostAndTimeReductionLifeformTechnology[];

    collectorClassBonus: number;
    collectorClassBonusTechnologies: CollectorClassBonusLifeformTechnology[];
}

export class AmortizationItemGenerator {
    readonly #settings: AmortizationGenerationSettings;
    readonly #playerData: LocalPlayerData;
    readonly #serverSettings: ServerSettings;

    #generator: Generator<AmortizationItem, void, unknown> | null = null;
    readonly #state = {
        planets: {} as Record<number, AmortizationPlanetState>,
        research: createRecord(ResearchTypes, 0),

        get totalCollectorClassBonus() {
            return Object.values(this.planets).reduce((acc, cur) => acc + cur.collectorClassBonus, 0);
        },
        get totalPlasmaTechnologyCostReduction() {
            return Object.values(this.planets).reduce((acc, cur) => acc + cur.plasmaTechnologyCostReduction, 0);
        },
    };

    public constructor(settings: AmortizationGenerationSettings, playerData: LocalPlayerData, serverSettings: ServerSettings) {
        this.#settings = settings;
        this.#playerData = playerData;
        this.#serverSettings = serverSettings;
    }

    public nextItem(): AmortizationItem | null {
        const generator = this.#generator ?? this.#initGenerator();
        const result = generator.next();
        if (result.done) {
            return null;
        }

        return result.value;
    }

    #initGenerator(): Generator<AmortizationItem, void, unknown> {
        const generator = this.#generateNextItem();

        Object.values(this.#settings.planets).forEach(planet => {
            this.#state.planets[planet.id] = {} as AmortizationPlanetState;

            this.#init_planetData(planet);

            this.#init_lifeformBuildingCostReductions(planet);
            this.#init_mineCostReductions(planet);
            this.#init_plasmaTechnologyCostReductions(planet);
        });
        this.#state.research[ResearchType.plasmaTechnology] = this.#settings.player.levelPlasmaTechnology;
        this.#state.research[ResearchType.astrophysics] = this.#settings.player.levelAstrophysics;

        const baseProductionDependencies: ProductionDependencies = {
            planet: null!,
            serverSettings: this.#serverSettings,
            player: {
                allianceClass: this.#settings.player.allianceClass,
                playerClass: this.#settings.player.playerClass,
                lifeformExperience: this.#playerData.lifeformExperience,
                officers: this.#settings.player.officers,
                research: this.#state.research,
                planetOrder: [],
                planets: Object.values(this.#state.planets)
                    .reduce((acc, cur) => {
                        acc[cur.data.id] = cur.data;
                        return acc;
                    }, {} as Record<number, PlanetData>),
            },
        };
        // init production breakdowns
        Object.values(this.#settings.planets).forEach(planetSettings => {
            const deps: ProductionDependencies = {
                ...baseProductionDependencies,
                planet: this.#state.planets[planetSettings.id].data,
            };

            this.#state.planets[planetSettings.id].productionBreakdowns = {
                metal: getMetalProduction(deps),
                crystal: getCrystalProduction(deps),
                deuterium: getDeuteriumProduction(deps),
            };
        });

        //TODO: per planet this.#state.collectorClassBonus = getLifeformCollectorClassBonus(this.#playerData);

        return this.#generator = generator;
    }

    #init_plasmaTechnologyCostReductions(planet: AmortizationPlanetSettings) {
        let plasmaTechCostReduction = 0;
        const plasmaTechCostReductionTechnologies = ResearchCostAndTimeReductionLifeformTechnologies.filter(
            tech => planet.activeLifeformTechnologies.includes(tech.type)
                && tech.appliesTo(ResearchType.plasmaTechnology)
        );
        plasmaTechCostReductionTechnologies.forEach(tech => {
            const level = planet.lifeformTechnologyLevels?.[tech.type] ?? 0;
            plasmaTechCostReduction += tech.getResearchCostAndTimeReduction(ResearchType.plasmaTechnology, level).cost;
        });

        this.#state.planets[planet.id].plasmaTechnologyCostReduction = plasmaTechCostReduction;
        this.#state.planets[planet.id].plasmaTechnologyCostReductionTechnologies = plasmaTechCostReductionTechnologies;
    }

    #init_lifeformBuildingCostReductions(planet: AmortizationPlanetSettings) {
        const lifeformBuildingCostReduction = createRecord(LifeformBuildingTypes, 0);

        const lfCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform];
        LifeformBuildingTypesByLifeform[planet.lifeform].forEach(lfBuilding => {
            const costReduction = lfCostReductionBuildings.reduce(
                (total, building) => {
                    const level = planet.lifeformBuildingLevels?.[building.type] ?? 0;
                    const costReduction = building.getCostAndTimeReduction(lfBuilding, level).cost;
                    return total + costReduction;
                }, 0);

            lifeformBuildingCostReduction[lfBuilding] = costReduction;
        });
        this.#state.planets[planet.id].lifeformBuildingCostReduction = lifeformBuildingCostReduction;
        this.#state.planets[planet.id].lifeformBuildingCostReductionBuildings = lfCostReductionBuildings;
    }

    #init_mineCostReductions(planet: AmortizationPlanetSettings) {
        const lfMineCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform]
            .filter(b => $mineBuildingTypes.some(mineType => b.appliesTo(mineType)));

        const costReductionByMine = {} as Record<MineBuildingType, number>;
        $mineBuildingTypes.forEach(mineType => {
            costReductionByMine[mineType] = lfMineCostReductionBuildings
                .filter(b => b.appliesTo(mineType))
                .reduce((total, building) => {
                    const lfBuildingLevel = planet.lifeformBuildingLevels?.[building.type] ?? 0;
                    const costReduction = building.getCostAndTimeReduction(mineType, lfBuildingLevel).cost;
                    return total + costReduction;
                }, 0);
        });

        this.#state.planets[planet.id].mineCostReductions = costReductionByMine;
        this.#state.planets[planet.id].mineCostReductionBuildings = lfMineCostReductionBuildings;
    }

    #init_planetData(planet: AmortizationPlanetSettings) {
        this.#state.planets[planet.id].data = {
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
            lifeformBuildings: { ...(planet.lifeformBuildingLevels ?? createRecord(LifeformBuildingTypes, 0)) },
            lifeformTechnologies: { ...(planet.lifeformTechnologyLevels ?? createRecord(LifeformTechnologyTypes, 0)) },
            maxTemperature: planet.maxTemperature,
            productionSettings: {
                [BuildingType.metalMine]: 100,
                [BuildingType.crystalMine]: 100,
                [BuildingType.deuteriumSynthesizer]: 100,
                [ShipType.crawler]: 100,
            } as ProductionSettings,
            ships: {
                [ShipType.crawler]: planet.crawlers.max ? 10000 : planet.crawlers.count,
            } as PlanetShipCount,
        };
    }

    * #generateNextItem(): Generator<AmortizationItem, void, unknown> {
        let newPlanets = 0;

        while (true) {
            const mineItems = this.#getMineAmortizationItems();
            const plasmaTechItem = this.#getPlasmaTechnologyAmortizationItem();
            // const astrophysicsItem = this.#getAstrophysicsAmortizationItem();
            // const lifeformBuildingItems = this.#getLifeformBuildingAmortizationItems();
            // const lifeformTechnologyItems = this.#getLifeformTechnologyItems();

            const items: AmortizationItem[] = [
                ...mineItems,
                plasmaTechItem,
                // astrophysicsItem,
                // ...lifeformBuildingItems,
                // ...lifeformTechnologyItems,
            ].filter(item => item.productionDeltaMsu > 0) //remove items with production delta = 0, because plasmatech and others can have no effect if there are no mines at all
                .sort((a, b) => {
                    // sort by amortization time, then by cost
                    const compareTime = a.timeInHours - b.timeInHours;
                    if (compareTime != 0) {
                        return compareTime;
                    }

                    return a.costMsu - b.costMsu;
                });

            const bestItem = items[0];
            let yieldItem: boolean = true;
            switch (bestItem.type) {
                case 'mine': {
                    const planetState = this.#state.planets[bestItem.planetId];
                    const planetData = planetState.data;
                    // save new mine level
                    planetData.buildings[bestItem.mine] = bestItem.level;
                    // apply new lf building levels
                    bestItem.additionalLifeformBuildings.forEach(b => {
                        planetData.lifeformBuildings[b.building] = b.levels.to;
                    });

                    // save new mine production
                    const resource = $resourceByMineType[bestItem.mine];
                    planetState.productionBreakdowns[resource].mineProduction = bestItem.newMineProduction;

                    //TODO: apply bestItem.newBuildingCostReduction, bestItem.newLifeformBuildingCostReduction

                    yieldItem = this.#settings.planets[planetData.id].show;
                    break;
                }

                case 'plasma-technology': {
                    // save new plasma technology level
                    this.#state.research[ResearchType.plasmaTechnology] = bestItem.level;
                    // apply new lf building/technology levels
                    bestItem.additionalLifeformStuff.forEach(bt => {
                        const planetData = this.#state.planets[bt.planetId].data;
                        if ('building' in bt) {
                            planetData.lifeformBuildings[bt.building] = bt.levels.to;
                        } else {
                            planetData.lifeformTechnologies[bt.technology] = bt.levels.to;
                        }
                    });

                    // apply new plasma technology level
                    Object.values(this.#state.planets).forEach(planet => {
                        const breakdowns = planet.productionBreakdowns;
                        breakdowns.metal.plasmaTechnologyLevel = bestItem.level;
                        breakdowns.crystal.plasmaTechnologyLevel = bestItem.level;
                        breakdowns.deuterium.plasmaTechnologyLevel = bestItem.level;
                    });

                    //TODO: apply bestItem.newPlasmaTechnologyCostReduction, bestItem.newLifeformTechnologyCostReduction, bestItem.newLifeformBuildingCostReduction

                    yieldItem = this.#settings.showPlasmaTechnology;
                    break;
                }

                //TODO: handle best item type
                default: throw new Error('not implemented');
            }

            if (yieldItem) {
                yield bestItem;
            }
        }
    }

    // #getLifeformTechnologyItems(): LifeformTechnologyAmortizationItem[] {

    // }

    // #getLifeformBuildingAmortizationItems(): LifeformBuildingAmortizationItem[] {

    // }

    // #getAstrophysicsAmortizationItem(): AstrophysicsAmortizationItem {

    // }

    #getPlasmaTechnologyAmortizationItem(): PlasmaTechnologyAmortizationItem {
        const newLevel = this.#state.research[ResearchType.plasmaTechnology] + 1;

        const researchCost = PlasmaTechnology.getCost(newLevel);

        let technologyBonus = 0; //TODO: apply technology bonuses
        let costReduction = this.#state.totalPlasmaTechnologyCostReduction;
        let reducedResearchCost = multiplyCostInt(researchCost, 1 - costReduction * (1 + technologyBonus));
        let reducedResearchCostMsu = this.#getMsu(reducedResearchCost);

        const planetStates = Object.values(this.#state.planets);
        while (true) {
            //TODO: take best of
            //      - plasmaTech cost reduction technology level(s), while cost <= plasmaTech cost reduction
            //          - + research building level(s), while building cost <= plasmaTech cost reduction tech cost reduction
            //              - + lifeform building cost reduction level(s)...
            //      - lifeform technology bonus building level(s), while cost <= plasmaTech cost reduction through additional tech bonus 
            //          - + lifeform building cost reduction level(s)...

            break;
        }
        /* TODO: include cost reduction through lifeform technologies (also include cost reduction of technologies through lf-research lab, which itself can also have reduced cost again)
        const lfCostReductionTechnologies = ResearchCostAndTimeReductionLifeformTechnologies.filter(r => r.appliesTo(ResearchType.plasmaTechnology));
        let reducedCostMsu
        */

        const curProduction = Object.values(this.#state.planets).reduce<Cost>(
            (acc, cur) => {
                const breakdowns = cur.productionBreakdowns;
                acc.metal += breakdowns.metal.total;
                acc.crystal += breakdowns.crystal.total;
                acc.deuterium += breakdowns.deuterium.total;
                return acc;
            },
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );

        const newProduction = Object.values(this.#state.planets).reduce<Cost>(
            (acc, cur) => {
                const breakdowns = cur.productionBreakdowns;
                const metalProduction = breakdowns.metal.clone();
                const crystalProduction = breakdowns.crystal.clone();
                const deuteriumProduction = breakdowns.deuterium.clone();
                metalProduction.plasmaTechnologyLevel = newLevel;
                crystalProduction.plasmaTechnologyLevel = newLevel;
                deuteriumProduction.plasmaTechnologyLevel = newLevel;

                acc.metal += metalProduction.total;
                acc.crystal += crystalProduction.total;
                acc.deuterium += deuteriumProduction.total;
                return acc;
            },
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );

        const productionDelta = subCost(newProduction, curProduction);
        const productionDeltaMsu = this.#getMsu(productionDelta);

        // TODO: add info to returned object: new plasmatech cost reduction, new lf research cost reduction
        return {
            type: 'plasma-technology',
            level: newLevel,
            additionalLifeformStuff: [],//TODO: additional lifeform technologies and buildings

            //TODO: set cost reductions
            newPlasmaTechnologyCostReduction: 0,
            newLifeformBuildingCostReduction: createRecord(LifeformBuildingTypes, 0),
            newLifeformTechnologyCostReduction: createRecord(LifeformTechnologyTypes, 0),

            cost: researchCost,
            costMsu: reducedResearchCostMsu,
            productionDelta,
            productionDeltaMsu,
            timeInHours: reducedResearchCostMsu / productionDeltaMsu,
        };
    }

    #getMineAmortizationItems(): MineAmortizationItem[] {
        return Object.values(this.#settings.planets).flatMap(
            planet => $mineBuildingTypes.map(
                mineType => this.#getMineAmortizationItem(planet.id, mineType))
        );
    }
    #getMineAmortizationItem(planetId: number, mineType: MineBuildingType): MineAmortizationItem {
        const planetState = this.#state.planets[planetId];
        const planetData = planetState.data;
        const newLevel = planetData.buildings[mineType] + 1;

        const mine = $minesByType[mineType];
        let mineCostReduction = planetState.mineCostReductions[mineType];
        let lifeformBuildingCostReduction = planetState.lifeformBuildingCostReduction;

        const mineCost = mine.getCost(newLevel);
        let reducedCost = multiplyCostInt(mineCost, 1 - mineCostReduction);
        let reducedCostMsu = this.#getMsu(reducedCost);
        const additionalLifeformBuildings: LifeformBuildingLevels[] = [];

        const result = this.#getMineAmortization_costReduction(planetState, mineType);
        if (result != null) {
            reducedCost = result.totalReducedCost;
            reducedCostMsu = result.totalReducedCostMsu;
            mineCostReduction = result.mineCostReduction[mineType];
            lifeformBuildingCostReduction = result.lifeformBuildingCostReduction;

            const additionalLifeformBuildingsByBuilding: Partial<Record<LifeformBuildingType, LifeformBuildingLevels>> = {};
            result.additionalLifeformBuildings.forEach(item => {
                let levels = additionalLifeformBuildingsByBuilding[item.building];
                if (levels == null) {
                    levels = {
                        planetId: planetData.id,
                        building: item.building,
                        levels: {
                            from: item.level,
                            to: item.level,
                        },
                    };
                    additionalLifeformBuildingsByBuilding[item.building] = levels;
                    additionalLifeformBuildings.push(levels);
                }

                levels.levels.to = item.level;
            });
        }

        const newMineProduction = mine.getProduction(newLevel, this.#buildProductionBuildingDependencies(planetId));
        const newCrawlerBoost = getCrawlerBoost({
            availableCrawlers: planetData.ships[ShipType.crawler],
            collectorClassBonus: this.#state.totalCollectorClassBonus,
            crawlerProductionSetting: planetData.productionSettings[ShipType.crawler],
            hasGeologist: this.#playerData.officers.geologist,
            playerClass: this.#playerData.playerClass,
            levelMetalMine: mineType == BuildingType.metalMine
                ? newLevel
                : planetData.buildings[BuildingType.metalMine],
            levelCrystalMine: mineType == BuildingType.crystalMine
                ? newLevel
                : planetData.buildings[BuildingType.crystalMine],
            levelDeuteriumSynthesizer: mineType == BuildingType.deuteriumSynthesizer
                ? newLevel
                : planetData.buildings[BuildingType.deuteriumSynthesizer],
            serverSettings: this.#serverSettings,
        });

        const resource = $resourceByMineType[mineType];
        const productionBreakdown = planetState.productionBreakdowns[resource];
        const newProductionBreakdown = productionBreakdown.clone();
        newProductionBreakdown.mineProduction = newMineProduction;
        newProductionBreakdown.crawlerBonus = newCrawlerBoost;

        const productionDeltaValue = newProductionBreakdown.total - productionBreakdown.total;
        const productionDelta: Cost = {
            metal: 0, crystal: 0, deuterium: 0, energy: 0,
            [resource]: productionDeltaValue,
        };
        const productionDeltaMsu = this.#getMsu(productionDelta);

        return {
            type: 'mine',
            planetId,
            mine: mineType,
            level: newLevel,
            additionalLifeformBuildings,

            newMineProduction: newProductionBreakdown.mineProduction,
            newMineCostReduction: createRecord(
                $mineBuildingTypes,
                type => type == mineType
                    ? mineCostReduction
                    : planetState.mineCostReductions[type]
            ),
            newLifeformBuildingCostReduction: lifeformBuildingCostReduction,

            cost: reducedCost,
            costMsu: reducedCostMsu,
            productionDelta,
            productionDeltaMsu,
            timeInHours: reducedCostMsu / productionDeltaMsu,
        };
    }

    #getMineAmortization_costReduction(planetState: AmortizationPlanetState, mineType: MineBuildingType) {
        interface PotentialMineCostReductionBuilding {
            building: LifeformBuilding & AnyBuildingCostAndTimeReductionLifeformBuilding;
            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostMsu: number;
        }

        const planetData = planetState.data;

        const mineCostReductionBuildings = planetState.mineCostReductionBuildings;
        if (mineCostReductionBuildings.length == 0) {
            return;
        }

        let mineCostReduction = planetState.mineCostReductions;
        const lifeformBuildingCostReduction = { ...planetState.lifeformBuildingCostReduction };
        const lifeformBuildingLevels = { ...planetData.lifeformBuildings };

        const newLevel = planetData.buildings[mineType] + 1;
        const mine = $minesByType[mineType];

        const mineCost = mine.getCost(newLevel);
        const reducedMineCost = multiplyCostInt(mineCost, 1 - mineCostReduction[mineType]);

        const costs: { building: MineBuildingType | LifeformBuildingType; level: number; cost: Cost }[] = [{
            building: mineType,
            cost: mineCost,
            level: newLevel,
        }];
        let totalReducedCost = reducedMineCost;
        let totalReducedCostMsu = this.#getMsu(reducedMineCost);


        const lifeformBuildingCostReductionBuildings = planetState.lifeformBuildingCostReductionBuildings;
        const potentialMineReductionBuildingReduceFunction = (best: PotentialMineCostReductionBuilding | null, building: AnyBuildingCostAndTimeReductionLifeformBuilding) => {
            const newLevel = lifeformBuildingLevels[building.type] + 1;
            const cost = building.getCost(newLevel);
            const reducedCost = multiplyCostInt(cost, 1 - lifeformBuildingCostReduction[building.type]);

            const newTotalReducedCost = costs.reduce<Cost>((total, cur) => {
                const costReduction = cur.building == mineType
                    ? mineCostReduction[mineType]
                    : lifeformBuildingCostReduction[building.type];

                const additionalCostReduction = cur.building != building.type
                    ? (building.getCostAndTimeReduction(cur.building, newLevel).cost
                        - building.getCostAndTimeReduction(cur.building, newLevel - 1).cost)
                    : 0; // no additional cost reduction for ealier levels of itself

                const newCostReduction = costReduction + additionalCostReduction;
                const curReducedCost = multiplyCostInt(cur.cost, 1 - newCostReduction);

                return addCost(total, curReducedCost);
            }, reducedCost);

            const newTotalReducedCostMsu = this.#getMsu(newTotalReducedCost);

            if (newTotalReducedCostMsu <= totalReducedCostMsu && (best == null || newTotalReducedCostMsu < best.newTotalReducedCostMsu)) {
                return {
                    building,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostMsu,
                };
            }

            return best;
        };

        while (true) {
            const bestBuilding = mineCostReductionBuildings.reduce<PotentialMineCostReductionBuilding | null>(potentialMineReductionBuildingReduceFunction, null)
                ?? lifeformBuildingCostReductionBuildings.reduce<PotentialMineCostReductionBuilding | null>(potentialMineReductionBuildingReduceFunction, null);

            if (bestBuilding == null) {
                break;
            }

            costs.push({
                building: bestBuilding.building.type,
                cost: bestBuilding.cost,
                level: bestBuilding.level,
            });
            totalReducedCost = bestBuilding.newTotalReducedCost;
            totalReducedCostMsu = bestBuilding.newTotalReducedCostMsu;

            lifeformBuildingLevels[bestBuilding.building.type]++;

            bestBuilding.building.affectedBuildings.forEach(affectedBuildingType => {
                const additionalCostReduction = bestBuilding.building.getCostAndTimeReduction(affectedBuildingType, bestBuilding.level).cost
                    - bestBuilding.building.getCostAndTimeReduction(affectedBuildingType, bestBuilding.level - 1).cost;

                if (($mineBuildingTypes as AnyBuildingType[]).includes(affectedBuildingType)) {
                    mineCostReduction[affectedBuildingType as MineBuildingType] += additionalCostReduction
                }
                else {
                    lifeformBuildingCostReduction[affectedBuildingType as LifeformBuildingType] += additionalCostReduction;
                }
            });
        }

        const additionalLifeformBuildings = costs
            .filter(c => (LifeformBuildingTypes as AnyBuildingType[]).includes(c.building))
            .map(c => ({
                building: c.building as LifeformBuildingType,
                level: c.level,
            })).sort((a, b) => {
                const aIsMineReduction = mineCostReductionBuildings.some(mb => mb.type == a.building);
                const bIsMineReduction = mineCostReductionBuildings.some(mb => mb.type == b.building);
                if (aIsMineReduction) {
                    if (!bIsMineReduction) {
                        return 1;
                    }
                    return a.level - b.level;
                }
                if (bIsMineReduction) {
                    return -1;
                }

                return a.level - b.level;
            });

        return {
            totalReducedCost,
            totalReducedCostMsu,
            mineCostReduction,
            lifeformBuildingCostReduction,
            additionalLifeformBuildings,
        };
    }

    #buildProductionBuildingDependencies(planetId: number): ProductionBuildingDependencies {
        const planetData = this.#state.planets[planetId].data;
        return {
            planet: {
                position: planetData.coordinates.position,
                temperature: planetData.maxTemperature,
            },
            productionSettings: {
                metalMine: planetData.productionSettings[BuildingType.metalMine],
                crystalMine: planetData.productionSettings[BuildingType.crystalMine],
                deuteriumSynthesizer: planetData.productionSettings[BuildingType.deuteriumSynthesizer],
                fusionReactor: planetData.productionSettings[BuildingType.fusionReactor],
            },
            serverSettings: {
                economySpeed: this.#serverSettings.speed.economy,
                crystalBoost: this.#serverSettings.resourceProduction.productionFactorBonus.crystal,
            },
        };
    }

    #getMsu(cost: Cost): number {
        return cost.metal
            + cost.crystal * this.#settings.player.msuConversionRates.crystal
            + cost.deuterium * this.#settings.player.msuConversionRates.deuterium;
    }
}


/**********************************/
/************OLD CODE**************/
/**********************************/
/*
private * generateAmortizationItems(settings: AmortizationGenerationSettings): Generator<AmortizationItem, void, unknown> {
            if (Object.keys(settings.planets).length == 0) {
                return;
            }

            let { levelPlasmaTechnology, levelAstrophysics } = settings.player;

            const planets = { ...this.empire.planets } as Record<number, PlanetData>;
            const planetSettings = { ...settings.planets };
            const planetIds: number[] = Object.values(planetSettings).map(planet => planet.id);

            const calculationData: Record<number, AmortizationCalculationData> = {};
            Object.values(planetSettings).forEach(planet => {
                calculationData[planet.id] = {
                    mineLevels: {
                        [BuildingType.metalMine]: planet.mines?.metalMine ?? 0,
                        [BuildingType.crystalMine]: planet.mines?.crystalMine ?? 0,
                        [BuildingType.deuteriumSynthesizer]: planet.mines?.deuteriumSynthesizer ?? 0,
                    },
                    lifeformBuildingLevels: createRecord(LifeformBuildingTypes, type => planet.lifeformBuildingLevels?.[type] ?? 0),
                    lifeformTechnologyLevels: createRecord(LifeformTechnologyTypes, type => planet.lifeformTechnologyLevels?.[type] ?? 0),
                };
            });

            let newPlanets = 0;

            while (true) {
                const mineItems = planetIds.flatMap(
                    planetId => this.mineBuildingTypes.map(
                        building => this.getMineAmortizationItem(
                            planetId,
                            building,
                            calculationData[planetId],
                            levelPlasmaTechnology,
                            planets[planetId] as PlanetData,
                            planetSettings[planetId],
                            settings,
                        ),
                    ),
                );
                const plasmaTechItem = this.getPlasmaTechnologyAmortizationItem(calculationData, levelPlasmaTechnology, settings);
                const astrophysicsItem = this.getAstrophysicsAmortizationItem(levelAstrophysics, levelPlasmaTechnology, planetIds.length, -(newPlanets + 1), settings);
                const lifeformBuildingItems = planetIds.flatMap(
                    planetId => this.getApplicableLifeformBuildingTypesByLifeform(planetSettings[planetId].lifeform).map(
                        building => this.getLifeformBuildingAmortizationItem(
                            planetId,
                            building,
                            calculationData[planetId],
                            levelPlasmaTechnology,
                            planets[planetId] as PlanetData,
                            planetSettings[planetId],
                            settings,
                        ),
                    ),
                );
                const lifeformTechnologyItems = planetIds.flatMap(
                    planetId => planetSettings[planetId].activeLifeformTechnologies
                        .filter(tech => this.applicableLifeformTechnologyTypes.includes(tech))
                        .map(tech => this.getLifeformTechnologyAmortizationItem(
                            planetId,
                            tech,
                            calculationData[planetId],
                            levelPlasmaTechnology,
                            planets[planetId] as PlanetData,
                            planetSettings[planetId],
                            settings,
                        )),
                );

                const items = [
                    ...mineItems,
                    plasmaTechItem,
                    astrophysicsItem,
                    ...lifeformBuildingItems,
                    ...lifeformTechnologyItems,
                ].filter(item => item.productionDeltaMsu > 0); //remove items with production delta = 0, because plasmatech and others can have no effect if there are no mines at all

                const bestItem = items.reduce(
                    (best, item) => item.timeInHours < best.timeInHours ? item : best,
                    { timeInHours: Infinity } as AmortizationItem
                );

                let yieldItem: boolean;

                switch (bestItem.type) {
                    case 'mine': {
                        calculationData[bestItem.planetId].mineLevels[bestItem.mine] = bestItem.level;
                        yieldItem = this.planetSettings[bestItem.planetId].show;
                        break;
                    }

                    case 'plasma-technology': {
                        levelPlasmaTechnology = bestItem.level;
                        yieldItem = this.showPlasmaTechnology;
                        break;
                    }

                    case 'astrophysics-and-colony': {
                        levelAstrophysics = bestItem.levels[bestItem.levels.length - 1] ?? levelAstrophysics;
                        newPlanets++;

                        // add new planet that has to be considered for future amortization items
                        planetIds.push(bestItem.newPlanetId);
                        planetSettings[bestItem.newPlanetId] = this.astrophysicsSettings.planet;
                        calculationData[bestItem.newPlanetId] = { ...bestItem.builtLevels };

                        const fakePlanet = this.getFakePlanet();
                        planets[bestItem.newPlanetId] = this.buildProductionDependencies(calculationData[bestItem.newPlanetId], 0, fakePlanet, this.astrophysicsSettings.planet, settings).planet;

                        yieldItem = this.astrophysicsSettings.show;
                        break;
                    }

                    case 'lifeform-building': {
                        calculationData[bestItem.planetId].lifeformBuildingLevels[bestItem.building] = bestItem.level;
                        yieldItem = this.planetSettings[bestItem.planetId].show;
                        break;
                    }

                    case 'lifeform-technology': {
                        calculationData[bestItem.planetId].lifeformTechnologyLevels[bestItem.technology] = bestItem.level;
                        yieldItem = this.planetSettings[bestItem.planetId].show;
                        break;
                    }
                }

                if (yieldItem) {
                    yield bestItem;
                }
            }
        }

        private getFakePlanet(): PlanetData {
            return {
                isMoon: false,
                maxTemperature: 0,
                buildings: createRecord(BuildingTypes, 0),
                ships: createRecord(ShipTypes, 0),
                activeLifeform: LifeformType.none,
                lifeformBuildings: createRecord(LifeformBuildingTypes, 0),
                lifeformTechnologies: createRecord(LifeformTechnologyTypes, 0),
                productionSettings: {} as ProductionSettings,
                activeLifeformTechnologies: [],
                id: 0,
                name: '',
                coordinates: {} as Coordinates,
                defense: {} as DefenseCount,
                activeItems: {},
            };
        }

        private getAstrophysicsAmortizationItem(
            levelAstrophysics: number,
            levelPlasmaTechnology: number,
            curPlanetCount: number,
            newPlanetId: number,
            settings: AmortizationGenerationSettings
        ): AstrophysicsAmortizationItem {

            const maxPlanetCount = Math.ceil(levelAstrophysics / 2) + 1;
            const nextLevelAstrophysics = levelAstrophysics + levelAstrophysics % 2 + 1;

            const levels: number[] = [];
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
            // if there are unused colony slots, then we don't need a higher astrophysics level
            if (curPlanetCount == maxPlanetCount) {
                for (let l = levelAstrophysics + 1; l <= nextLevelAstrophysics; l++) {
                    levels.push(l);

                    const levelCost = Astrophysics.getCost(l);
                    cost = addCost(cost, levelCost);
                }
            }

            const fakePlanet = this.getFakePlanet();

            const calcData: AmortizationCalculationData = {
                mineLevels: createRecord(this.mineBuildingTypes, 0),
                lifeformBuildingLevels: createRecord(LifeformBuildingTypes, 0),
                lifeformTechnologyLevels: createRecord(LifeformTechnologyTypes, 0),
            };
            let totalCost: Cost = { ...cost };
            let production: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
            let timeInHours = Infinity;
            do {
                const mineItems = this.mineBuildingTypes.map(mineType =>
                    this.getMineAmortizationItem(-1, mineType, calcData, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings)
                );
                const lfBuildings = LifeformBuildingTypesByLifeform[this.astrophysicsSettings.planet.lifeform]
                    .filter(building => this.applicableLifeformBuildingTypes.includes(building));
                const lfBuildingItems = lfBuildings.map(building =>
                    this.getLifeformBuildingAmortizationItem(-1, building, calcData, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings)
                );
                const lfTechs = LifeformTechnologyTypesByLifeform[this.astrophysicsSettings.planet.lifeform]
                    .filter(tech => this.applicableLifeformTechnologyTypes.includes(tech));
                const lfTechItems = lfTechs.map(tech =>
                    this.getLifeformTechnologyAmortizationItem(-1, tech, calcData, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings)
                );

                const items = [...mineItems, ...lfBuildingItems, ...lfTechItems];

                const bestItem = items.reduce(
                    (best, item) => item.timeInHours < best.timeInHours ? item : best,
                    { timeInHours: Infinity } as MineAmortizationItem
                );

                const newTotalCost = addCost(totalCost, bestItem.cost);
                const newTotalCostMsu = this.getMsu(newTotalCost, settings);

                const newProduction = addCost(production, bestItem.productionDelta);
                const newProductionMsu = this.getMsu(newProduction, settings);

                const newTimeInHours = newTotalCostMsu / newProductionMsu;
                if (newTimeInHours > timeInHours) {
                    break;
                }

                timeInHours = newTimeInHours;
                production = newProduction;
                totalCost = newTotalCost;

                if (bestItem.type == 'mine') {
                    calcData.mineLevels[bestItem.mine]++;
                } else if (bestItem.type == 'lifeform-building') {
                    calcData.lifeformBuildingLevels[bestItem.building]++;
                } else if (bestItem.type == 'lifeform-technology') {
                    calcData.lifeformTechnologyLevels[bestItem.technology]++;
                } else {
                    throw new Error('got unexpected item in astrophysics item calculation');
                }
            } while (true);

            return {
                type: 'astrophysics-and-colony',
                levels,
                builtLevels: calcData,
                cost: totalCost,
                costMsu: this.getMsu(totalCost, settings),
                productionDelta: production,
                productionDeltaMsu: this.getMsu(production, settings),
                timeInHours: timeInHours,
                newPlanetId,
            };
        }

        private getPlasmaTechnologyAmortizationItem(
            data: Record<number, AmortizationCalculationData>,
            levelPlasmaTechnology: number,
            settings: AmortizationGenerationSettings
        ): PlasmaTechnologyAmortizationItem {
            const newLevel = levelPlasmaTechnology + 1;

            const cost = PlasmaTechnology.getCost(newLevel);
            const costMsu = this.getMsu(cost, settings);

            const production = Object.values(this.planetSettings)
                .flatMap(planetSettings => {
                    const levels = data[planetSettings.id].mineLevels;
                    const dependencies = this.buildProductionDependencies(data[planetSettings.id], levelPlasmaTechnology, this.empire.planets[planetSettings.id] as PlanetData, planetSettings, settings);

                    return this.mineBuildingTypes.map(mineType =>
                        this.minesByType[mineType].getProduction(levels[mineType], dependencies)
                    );
                }).reduce(
                    (total, prod) => addCost(total, prod),
                    { metal: 0, crystal: 0, deuterium: 0, energy: 0 } as Cost
                );

            const newProduction = Object.values(this.planetSettings)
                .flatMap(planetSettings => {
                    const levels = data[planetSettings.id].mineLevels;
                    const dependencies = this.buildProductionDependencies(data[planetSettings.id], newLevel, this.empire.planets[planetSettings.id] as PlanetData, planetSettings, settings);
                    return this.mineBuildingTypes.map(mineType =>
                        this.minesByType[mineType].getProduction(levels[mineType], dependencies)
                    );
                }).reduce(
                    (total, prod) => addCost(total, prod),
                    { metal: 0, crystal: 0, deuterium: 0, energy: 0 } as Cost
                );

            const productionDelta = subCost(newProduction, production);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'plasma-technology',
                level: newLevel,

                cost,
                costMsu,
                productionDelta,
                productionDeltaMsu,
                timeInHours: costMsu / productionDeltaMsu,
            };
        }

        private getLifeformBuildingAmortizationItem(
            planetId: number,
            buildingType: LifeformBuildingType,
            data: AmortizationCalculationData,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings
        ): LifeformBuildingAmortizationItem {
            const building = LifeformBuildingsByType[buildingType];
            const newLevel = data.lifeformBuildingLevels[buildingType] + 1;

            const cost = building.getCost(newLevel);
            const costMsu = this.getMsu(cost, settings);

            const curDependencies = this.buildProductionDependencies(data, levelPlasmaTechnology, planet, planetSettings, settings);
            const curProduction = this.mineBuildingTypes
                .map(mineType => this.minesByType[mineType].getProduction(data.mineLevels[mineType], curDependencies))
                .reduce<Cost>((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            const newDependencies = this.buildProductionDependencies({
                ...data,
                lifeformBuildingLevels: {
                    ...data.lifeformBuildingLevels,
                    [buildingType]: newLevel,
                },
            }, levelPlasmaTechnology, planet, planetSettings, settings);

            const newProduction = this.mineBuildingTypes
                .map(mineType => this.minesByType[mineType].getProduction(data.mineLevels[mineType], newDependencies))
                .reduce<Cost>((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            const productionDelta = subCost(newProduction, curProduction);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'lifeform-building',
                planetId,
                building: buildingType,
                level: newLevel,

                cost,
                costMsu,
                productionDelta,
                productionDeltaMsu,
                timeInHours: costMsu / productionDeltaMsu,
            };
        }

        private getLifeformTechnologyAmortizationItem(
            planetId: number,
            technologyType: LifeformTechnologyType,
            data: AmortizationCalculationData,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings
        ): LifeformTechnologyAmortizationItem {
            const technology = LifeformTechnologiesByType[technologyType];
            const newLevel = data.lifeformTechnologyLevels[technologyType] + 1;

            const cost = technology.getCost(newLevel);
            const costMsu = this.getMsu(cost, settings);

            const curDependencies = this.buildProductionDependencies(data, levelPlasmaTechnology, planet, planetSettings, settings);
            const curProduction = this.mineBuildingTypes
                .map(mineType => this.minesByType[mineType].getProduction(data.mineLevels[mineType], curDependencies))
                .reduce<Cost>((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            const newDependencies = this.buildProductionDependencies({
                ...data,
                lifeformTechnologyLevels: {
                    ...data.lifeformTechnologyLevels,
                    [technologyType]: newLevel,
                },
            }, levelPlasmaTechnology, planet, planetSettings, settings);

            const newProduction = this.mineBuildingTypes
                .map(mineType => this.minesByType[mineType].getProduction(data.mineLevels[mineType], newDependencies))
                .reduce<Cost>((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            const productionDelta = subCost(newProduction, curProduction);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'lifeform-technology',
                planetId,
                technology: technologyType,
                level: newLevel,

                cost,
                costMsu,
                productionDelta,
                productionDeltaMsu,
                timeInHours: costMsu / productionDeltaMsu,
            };
        }

        private getMineAmortizationItem(
            planetId: number,
            mineType: MineBuildingType,
            data: AmortizationCalculationData,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings
        ): MineAmortizationItem {
            const mineLevel = data.mineLevels[mineType];

            const mine = {
                [BuildingType.metalMine]: MetalMine,
                [BuildingType.crystalMine]: CrystalMine,
                [BuildingType.deuteriumSynthesizer]: DeuteriumSynthesizer,
            }[mineType];

            const cost = mine.getCost(mineLevel + 1);
            const costMsu = this.getMsu(cost, settings);

            const dependencies = this.buildProductionDependencies(data, levelPlasmaTechnology, planet, planetSettings, settings);
            const curProduction = mine.getProduction(mineLevel, dependencies);
            const newProduction = mine.getProduction(mineLevel + 1, dependencies);
            const productionDelta = subCost(newProduction, curProduction);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'mine',
                planetId,
                mine: mineType,
                level: mineLevel + 1,

                cost,
                costMsu,
                productionDelta,
                productionDeltaMsu,
                timeInHours: costMsu / productionDeltaMsu,
            };
        }

        private buildProductionDependencies(
            data: AmortizationCalculationData,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings,
        ): ProductionBuildingDependencies {
            const builtPlanet: PlanetData = {
                ...planet,
                activeLifeform: planetSettings.lifeform,
                coordinates: {
                    ...planet.coordinates,
                    position: planetSettings.position,
                },
                maxTemperature: planetSettings.maxTemperature,
                productionSettings: {
                    [BuildingType.metalMine]: 100,
                    [BuildingType.crystalMine]: 100,
                    [BuildingType.deuteriumSynthesizer]: 100,
                    [BuildingType.solarPlant]: 100,
                    [BuildingType.fusionReactor]: 100,
                    [ShipType.crawler]: planetSettings.crawlers.enabled
                        ? planetSettings.crawlers.overload
                            ? 150
                            : 100
                        : 0,
                    [ShipType.solarSatellite]: 100,
                },
                activeItems: {
                    ...planet.activeItems,
                    ...planetSettings.activeItems.reduce(
                        (acc, item) => {
                            acc[item] = 'permanent';
                            return acc;
                        },
                        {} as Partial<Record<ItemHash, number | "permanent">>
                    ),
                },
                buildings: {
                    ...planet.buildings,
                    ...data.mineLevels,
                },
                ships: {
                    ...planet.ships,
                    [ShipType.crawler]: planetSettings.crawlers.max ? 10_000 : planetSettings.crawlers.count,
                },
                lifeformBuildings: {
                    ...data.lifeformBuildingLevels,
                },
                activeLifeformTechnologies: [...planetSettings.activeLifeformTechnologies],
                lifeformTechnologies: {
                    ...data.lifeformTechnologyLevels,
                },
            };

            const planets = { ...this.empire.planets } as Record<number, PlanetData>;

            Object.values(settings.planets).forEach(planetSettings =>
                planets[planetSettings.id] = {
                    ...planets[planetSettings.id],
                    activeLifeform: planetSettings.lifeform,
                    activeLifeformTechnologies: planetSettings.activeLifeformTechnologies,
                    lifeformTechnologies: planetSettings.lifeformTechnologyLevels ?? createRecord(LifeformTechnologyTypes, 0),
                }
            );

            planets[builtPlanet.id] = builtPlanet;
            return {
                serverSettings: ServerSettingsDataModule.serverSettings,
                planet: builtPlanet,
                player: {
                    ...this.empire,
                    playerClass: settings.player.playerClass,
                    allianceClass: settings.player.allianceClass,
                    officers: settings.player.officers,
                    research: {
                        ...this.empire.research,
                        [ResearchType.plasmaTechnology]: levelPlasmaTechnology,
                    },
                    planets,
                },
            };
        }

        private getMsu(cost: Cost, settings: AmortizationGenerationSettings): number {
            return cost.metal
                + cost.crystal * settings.player.msuConversionRates.crystal
                + cost.deuterium * settings.player.msuConversionRates.deuterium;
        }
*/