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
import { addCost, Cost, multiplyCost, multiplyCostInt, subCost } from "@/shared/models/ogame/common/Cost";
import { ItemHash } from "@/shared/models/ogame/items/ItemHash";
import { AnyBuildingCostAndTimeReductionLifeformBuilding, AnyBuildingType, LifeformTechnologyBonusLifeformBuilding, LifeformTechnologyResearchBuilding, ResourceProductionBonusLifeformBuilding } from "@/shared/models/ogame/lifeforms/buildings/interfaces";
import { AnyBuildingCostAndTimeReductionLifeformBuildings, AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform, LifeformTechnologyBonusLifeformBuildings, LifeformTechnologyBonusLifeformBuildingsByLifeform, LifeformTechnologyResearchBuildings, LifeformTechnologyResearchBuildingsByLifeform, ResourceProductionBonusLifeformBuildings, ResourceProductionBonusLifeformBuildingsByLifeform } from "@/shared/models/ogame/lifeforms/buildings/LifeformBuildings";
import { getLifeformTechnologyBonus } from "@/shared/models/ogame/lifeforms/experience";
import { LifeformBuildingType, LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { LifeformType, LifeformTypes, ValidLifeformTypes } from "@/shared/models/ogame/lifeforms/LifeformType";
import { CollectorClassBonusLifeformTechnology, ResearchCostAndTimeReductionLifeformTechnology, ResourceProductionBonusLifeformTechnology } from "@/shared/models/ogame/lifeforms/technologies/interfaces";
import { CollectorClassBonusLifeformTechnologies, CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies, ResearchCostAndTimeReductionLifeformTechnologies, ResourceProductionBonusLifeformTechnologies } from "@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies";
import { PlasmaTechnology } from "@/shared/models/ogame/research/PlasmaTechnology";
import { ResearchType, ResearchTypes } from "@/shared/models/ogame/research/ResearchType";
import { getCrawlerBoost } from "@/shared/models/ogame/resource-production/getCrawlerBoost";
import { getCrystalProduction } from "@/shared/models/ogame/resource-production/getCrystalProduction";
import { getDeuteriumProduction } from "@/shared/models/ogame/resource-production/getDeuteriumProduction";
import { getMetalProduction } from "@/shared/models/ogame/resource-production/getMetalProduction";
import { ProductionBreakdown, ProductionDependencies } from "@/shared/models/ogame/resource-production/types";
import { ResourceType, ResourceTypes } from "@/shared/models/ogame/resources/ResourceType";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { ServerSettings } from "@/shared/models/server-settings/ServerSettings";
import { createRecord } from "@/shared/utils/createRecord";
import { _throw } from "@/shared/utils/_throw";
import { AmortizationAstrophysicsSettings } from "./AmortizationAstrophysicsSettings";
import { AmortizationPlanetSettings } from "./AmortizationPlanetSettings";
import { AmortizationPlayerSettings } from "./AmortizationPlayerSettings";
import { AmortizationItem, LifeformBuildingAmortizationItem, LifeformBuildingLevels, LifeformTechnologyAmortizationItem, LifeformTechnologyLevels, MineAmortizationItem, MineBuildingType, PlasmaTechnologyAmortizationItem } from "./models";



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

    lifeformTechnologyBonus: number;
    lifeformTechnologyBonusBuildings: LifeformTechnologyBonusLifeformBuilding[];

    lifeformTechnologyCostReduction: number;
    lifeformResearchBuildings: LifeformTechnologyResearchBuilding[];
}

/* This class generates the next best amortizations items based on the settings provided.
 * Please don't a take a deep look into its code, it is awful.
 */
export class AmortizationItemGenerator {
    readonly #settings: AmortizationGenerationSettings;
    readonly #playerData: LocalPlayerData;
    readonly #serverSettings: ServerSettings;

    #generator: Generator<AmortizationItem, void, unknown> | null = null;
    readonly #state = {
        planets: {} as Record<number, AmortizationPlanetState>,
        research: createRecord(ResearchTypes, 0),
        lifeformExperienceBonus: createRecord(LifeformTypes, 0),

        get totalCollectorClassBonus() {
            return Object.values(this.planets).reduce(
                (acc, cur) => acc + cur.collectorClassBonus * (1 + cur.lifeformTechnologyBonus),
                0
            );
        },
        get totalPlasmaTechnologyCostReduction() {
            return Object.values(this.planets).reduce(
                (acc, cur) => acc + cur.plasmaTechnologyCostReduction * (1 + cur.lifeformTechnologyBonus),
                0
            );
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

            // lf building cost reduction
            const lfCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform];
            this.#state.planets[planet.id].lifeformBuildingCostReductionBuildings = lfCostReductionBuildings;

            // mine cost reduction
            const lfMineCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform]
                .filter(b => $mineBuildingTypes.some(mineType => b.appliesTo(mineType)));
            this.#state.planets[planet.id].mineCostReductionBuildings = lfMineCostReductionBuildings;

            // plasma tech cost reduction
            const plasmaTechCostReductionTechnologies = ResearchCostAndTimeReductionLifeformTechnologies.filter(
                tech => planet.activeLifeformTechnologies.includes(tech.type)
                    && tech.appliesTo(ResearchType.plasmaTechnology)
            );
            this.#state.planets[planet.id].plasmaTechnologyCostReductionTechnologies = plasmaTechCostReductionTechnologies;

            // lf research buildings
            const lifeformResearchBuildings = LifeformTechnologyResearchBuildingsByLifeform[planet.lifeform];
            this.#state.planets[planet.id].lifeformResearchBuildings = lifeformResearchBuildings;

            // collector class bonuses
            const collectorClassBonusTechnologies = CollectorClassBonusLifeformTechnologies.filter(
                tech => planet.activeLifeformTechnologies.includes(tech.type)
            );
            this.#state.planets[planet.id].collectorClassBonusTechnologies = collectorClassBonusTechnologies;

            // technology bonus buildings
            const techBonusBuildings = LifeformTechnologyBonusLifeformBuildingsByLifeform[planet.lifeform];
            this.#state.planets[planet.id].lifeformTechnologyBonusBuildings = techBonusBuildings;
        });
        this.#state.research[ResearchType.plasmaTechnology] = this.#settings.player.levelPlasmaTechnology;
        this.#state.research[ResearchType.astrophysics] = this.#settings.player.levelAstrophysics;

        ValidLifeformTypes.forEach(lf => {
            this.#state.lifeformExperienceBonus[lf] = getLifeformTechnologyBonus(this.#playerData.lifeformExperience[lf]);
        });

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


        this.#updateState();
        return this.#generator = generator;
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
            lifeformBuildings: {
                ...(planet.lifeformBuildingLevels?? createRecord(LifeformBuildingTypes, 0)),
                ...(createRecord(LifeformTechnologyResearchBuildings.map(b => b.type), 1)), // assume level 1 for lf research buildings
            },
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
            const lifeformBuildingItems = this.#getLifeformBuildingAmortizationItems();
            const lifeformTechnologyItems = this.#getLifeformTechnologyItems();

            const items: AmortizationItem[] = [
                ...mineItems,
                plasmaTechItem,
                // astrophysicsItem,
                ...lifeformBuildingItems,
                ...lifeformTechnologyItems,
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

                    yieldItem = this.#settings.showPlasmaTechnology;
                    break;
                }

                case 'lifeform-building': {
                    const planetState = this.#state.planets[bestItem.planetId];
                    const planetData = planetState.data;
                    // save new lf building level
                    planetData.lifeformBuildings[bestItem.building] = bestItem.level;
                    // apply new lf building levels
                    bestItem.additionalLifeformBuildings.forEach(b => {
                        planetData.lifeformBuildings[b.building] = b.levels.to;
                    });

                    // apply additional production bonus
                    ResourceTypes.forEach(resource => {
                        planetState.productionBreakdowns[resource].lifeformBuildingBonus += bestItem.additionalProductionBonus[resource];
                    });

                    yieldItem = this.#settings.planets[planetData.id].show;
                    break;
                }

                case 'lifeform-technology': {
                    const planetState = this.#state.planets[bestItem.planetId];
                    const planetData = planetState.data;
                    // save new lf technology level
                    planetData.lifeformTechnologies[bestItem.technology] = bestItem.level;
                    // apply new lf building levels
                    bestItem.additionalLifeformBuildings.forEach(b => {
                        planetData.lifeformBuildings[b.building] = b.levels.to;
                    });

                    // apply additional production bonus
                    ResourceTypes.forEach(resource => {
                        planetState.productionBreakdowns[resource].lifeformTechnologyBonus += bestItem.additionalProductionBonus[resource];
                    });

                    yieldItem = this.#settings.planets[planetData.id].show;
                    break;
                }

                //TODO: handle best item type
                default: throw new Error('not implemented');
            }

            this.#updateState();

            if (yieldItem) {
                yield bestItem;
            }
        }
    }

    /** generalized update of mine cost reductions, lifeform building cost reductions, lifeform technology cost reduction, lifeform technology bonus, plasmatech cost reduction, etc */
    #updateState() {
        const plasmaTechLevel = this.#state.research[ResearchType.plasmaTechnology];

        const planetStates = Object.values(this.#state.planets);
        planetStates.forEach(planetState => {
            // set new plasmatech level for production breakdowns
            const breakdowns = planetState.productionBreakdowns;
            breakdowns.metal.plasmaTechnologyLevel = plasmaTechLevel;
            breakdowns.crystal.plasmaTechnologyLevel = plasmaTechLevel;
            breakdowns.deuterium.plasmaTechnologyLevel = plasmaTechLevel;

            planetState.collectorClassBonus = planetState.collectorClassBonusTechnologies.reduce(
                (total, tech) => total + tech.getCollectorClassBonus(planetState.data.lifeformTechnologies[tech.type]),
                0
            );
            planetState.lifeformTechnologyBonus = planetState.lifeformTechnologyBonusBuildings.reduce(
                (total, building) => total + building.getLifeformTechnologyBonus(planetState.data.lifeformBuildings[building.type]),
                0
            );
            planetState.mineCostReductions = planetState.mineCostReductionBuildings.reduce(
                (total, building) => {
                    $mineBuildingTypes.forEach(mineType => total[mineType] += building.getCostAndTimeReduction(mineType, planetState.data.lifeformBuildings[building.type]).cost);
                    return total;
                },
                <Record<MineBuildingType, number>>{
                    [BuildingType.metalMine]: 0,
                    [BuildingType.crystalMine]: 0,
                    [BuildingType.deuteriumSynthesizer]: 0,
                },
            );
            planetState.plasmaTechnologyCostReduction = planetState.plasmaTechnologyCostReductionTechnologies.reduce(
                (total, tech) => total + tech.getResearchCostAndTimeReduction(ResearchType.plasmaTechnology, planetState.data.lifeformTechnologies[tech.type]).cost,
                0
            );
            planetState.lifeformBuildingCostReduction = planetState.lifeformBuildingCostReductionBuildings.reduce(
                (total, building) => {
                    LifeformBuildingTypes.forEach(lfBuildingType => total[lfBuildingType] += building.getCostAndTimeReduction(lfBuildingType, planetState.data.lifeformBuildings[building.type]).cost);
                    return total;
                },
                createRecord(LifeformBuildingTypes, 0),
            );
            planetState.lifeformTechnologyCostReduction = planetState.lifeformResearchBuildings.reduce(
                (total, building) => total + building.getLifeformTechnologyResearchCostAndTimeReduction(planetState.data.lifeformBuildings[building.type]).cost,
                0
            );

            //TODO: update mine productions in production breakdowns
            //TODO: update crawler bonus in production breakdowns
        });
    }

    #getLifeformTechnologyItems(): LifeformTechnologyAmortizationItem[] {
        return Object.values(this.#state.planets).flatMap(
            planet => ResourceProductionBonusLifeformTechnologies //TODO: include crawler bonus tech
                .filter(tech => planet.data.activeLifeformTechnologies.includes(tech.type))
                .map(tech => this.#getLifeformTechnologyItem(planet.data.id, tech))
        );
    }
    #getLifeformTechnologyItem(planetId: number, technology: ResourceProductionBonusLifeformTechnology): LifeformTechnologyAmortizationItem {
        const planetState = this.#state.planets[planetId];
        const planetData = planetState.data;
        const newLevel = planetData.lifeformTechnologies[technology.type] + 1;

        const result = this.#getLifeformTechnologyItem_costReduction(planetState, technology);
        const reducedCost = result.totalReducedCost;
        const reducedCostMsu = result.totalReducedCostMsu;

        const additionalLifeformBuildings: LifeformBuildingLevels[] = [];
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

        const additionalTechnologyBonus = result.newPlanetState.lifeformTechnologyBonus - planetState.lifeformTechnologyBonus;
        const additionalProductionBonus = multiplyCost(
            subCost(technology.getProductionBonus(newLevel), technology.getProductionBonus(newLevel - 1)),
            1 + additionalTechnologyBonus
        );

        const newProduction = Object.values(this.#state.planets).reduce<Cost>(
            (acc, cur) => {
                const breakdowns = cur.productionBreakdowns;
                if (cur.data.id == planetId) {
                    const metalProduction = breakdowns.metal.clone();
                    const crystalProduction = breakdowns.crystal.clone();
                    const deuteriumProduction = breakdowns.deuterium.clone();

                    metalProduction.lifeformTechnologyBonus += additionalProductionBonus.metal;
                    crystalProduction.lifeformTechnologyBonus += additionalProductionBonus.crystal;
                    deuteriumProduction.lifeformTechnologyBonus += additionalProductionBonus.deuterium;

                    acc.metal += metalProduction.total;
                    acc.crystal += crystalProduction.total;
                    acc.deuterium += deuteriumProduction.total;
                }
                else {
                    acc.metal += breakdowns.metal.total;
                    acc.crystal += breakdowns.crystal.total;
                    acc.deuterium += breakdowns.deuterium.total;
                }
                return acc;
            },
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );

        const productionDelta = subCost(newProduction, curProduction);
        const productionDeltaMsu = this.#getMsu(productionDelta);

        return {
            type: 'lifeform-technology',
            planetId,
            technology: technology.type,
            level: newLevel,

            additionalProductionBonus,
            additionalLifeformBuildings,

            cost: reducedCost,
            costMsu: reducedCostMsu,
            productionDelta,
            productionDeltaMsu,
            timeInHours: reducedCostMsu / productionDeltaMsu,
        };
    }
    #getLifeformTechnologyItem_costReduction(planetState: AmortizationPlanetState, technology: ResourceProductionBonusLifeformTechnology) {
        interface PotentialLifeformTechnologyCostReductionItemBase {
            planetId: number;
            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostMsu: number;
        };
        type PotentialLifeformTechnologyCostReductionTechnologyResearchBuilding = PotentialLifeformTechnologyCostReductionItemBase & { building: LifeformTechnologyResearchBuilding };
        type PotentialLifeformTechnologyCostReductionTechnologyBonusBuilding = PotentialLifeformTechnologyCostReductionItemBase & { building: LifeformTechnologyBonusLifeformBuilding };
        type PotentialLifeformTechnologyCostReductionBuildingCostReductionBuilding = PotentialLifeformTechnologyCostReductionItemBase & { building: AnyBuildingCostAndTimeReductionLifeformBuilding };
        type PotentialLifeformResourceBonusProductionTechnology = PotentialLifeformTechnologyCostReductionItemBase & { technology: ResourceProductionBonusLifeformTechnology };

        type PotentialLifeformTechnologyCostReductionItem =
            | PotentialLifeformTechnologyCostReductionTechnologyResearchBuilding
            | PotentialLifeformTechnologyCostReductionTechnologyBonusBuilding
            | PotentialLifeformTechnologyCostReductionBuildingCostReductionBuilding
            | PotentialLifeformResourceBonusProductionTechnology;

        type LifeformTechnologyAmortizationPartItem = {
            level: number;
            cost: Cost;
        } & (
                | { building: LifeformBuildingType; planetId: number }
                | { technology: LifeformTechnologyType; planetId: number }
            );

        const planetData = planetState.data;

        const localPlanetState = {
            lifeformBuildingLevels: { ...planetState.data.lifeformBuildings },
            lifeformTechnologyLevels: { ...planetState.data.lifeformTechnologies },
            lifeformTechnologyCostReduction: planetState.lifeformTechnologyCostReduction,
            lifeformBuildingCostReduction: { ...planetState.lifeformBuildingCostReduction },
            plasmaTechnologyCostReduction: planetState.plasmaTechnologyCostReduction,
            lifeformTechnologyBonus: planetState.lifeformTechnologyBonus,
        };

        const newLevel = planetData.lifeformTechnologies[technology.type] + 1;
        const currentTechnologyCostReduction = localPlanetState.lifeformTechnologyCostReduction;
        const technologyCost = technology.getCost(newLevel);
        const reducedTechnologyCost = multiplyCostInt(technologyCost, 1 - currentTechnologyCostReduction);

        const costs: LifeformTechnologyAmortizationPartItem[] = [{
            planetId: planetData.id,
            technology: technology.type,
            cost: technologyCost,
            level: newLevel,
        }];
        let totalReducedCost = reducedTechnologyCost;
        let totalReducedCostMsu = this.#getMsu(totalReducedCost);


        const potentialLifeformTechnologyCostReductionOrTechBonusBuildingReduceFunction = (
            best: PotentialLifeformTechnologyCostReductionTechnologyResearchBuilding | PotentialLifeformTechnologyCostReductionTechnologyBonusBuilding | null,
            building: LifeformTechnologyResearchBuilding | LifeformTechnologyBonusLifeformBuilding,
        ): PotentialLifeformTechnologyCostReductionTechnologyResearchBuilding | PotentialLifeformTechnologyCostReductionTechnologyBonusBuilding | null => {
            const newLevel = localPlanetState.lifeformBuildingLevels[building.type] + 1;
            const cost = building.getCost(newLevel);
            const reducedCost = multiplyCostInt(cost, 1 - localPlanetState.lifeformBuildingCostReduction[building.type]);

            let additionalCostReduction = 0;
            let additionalTechBonus = 0;
            if ('getLifeformTechnologyResearchCostAndTimeReduction' in building) {
                additionalCostReduction = building.getLifeformTechnologyResearchCostAndTimeReduction(newLevel).cost
                    - building.getLifeformTechnologyResearchCostAndTimeReduction(newLevel - 1).cost;
            } else {
                additionalTechBonus = building.getLifeformTechnologyBonus(newLevel) - building.getLifeformTechnologyBonus(newLevel - 1);
            }
            const newTotalReducedCost = costs.reduce<Cost>((total, cur) => {
                if ('building' in cur) {
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - localPlanetState.lifeformBuildingCostReduction[cur.building]);
                    return addCost(total, curReducedCost);
                }

                const technologyCostReduction = localPlanetState.lifeformTechnologyCostReduction + additionalCostReduction;
                const technologyBonus = planetState.lifeformTechnologyBonus + additionalTechBonus;
                const xpTechBonus = this.#state.lifeformExperienceBonus[planetData.activeLifeform];
                const costReduction = technologyCostReduction * (1 + technologyBonus) * (1 + xpTechBonus);

                const curReducedCost = multiplyCostInt(cur.cost, 1 - costReduction);

                return addCost(total, curReducedCost);
            }, reducedCost);

            const newTotalReducedCostMsu = this.#getMsu(newTotalReducedCost);

            if (newTotalReducedCostMsu <= totalReducedCostMsu && (best == null || newTotalReducedCostMsu < best.newTotalReducedCostMsu)) {
                const resultBase: PotentialLifeformTechnologyCostReductionItemBase = {
                    planetId: planetData.id,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostMsu,
                };

                // Typescript compiler throws error otherwise (update/upgrade needed?)
                if ('getLifeformTechnologyResearchCostAndTimeReduction' in building) {
                    return {
                        ...resultBase,
                        building,
                    };
                } else {
                    return {
                        ...resultBase,
                        building,
                    };
                }
            }

            return best;
        };

        //  - lf building cost reduction building (to reduce cost of lf buildings above with A)
        const potentialLifeformTechnologyCostIndirectReductionBuildingReduceFunction = (
            best: PotentialLifeformTechnologyCostReductionBuildingCostReductionBuilding | null,
            building: AnyBuildingCostAndTimeReductionLifeformBuilding,
        ): PotentialLifeformTechnologyCostReductionBuildingCostReductionBuilding | null => {
            const newLevel = localPlanetState.lifeformBuildingCostReduction[building.type] + 1;
            const cost = building.getCost(newLevel);
            const reducedCost = multiplyCostInt(cost, 1 - localPlanetState.lifeformBuildingCostReduction[building.type]);

            const newTotalReducedCost = costs.reduce<Cost>((total, cur) => {
                if ('technology' in cur) {
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - localPlanetState.lifeformTechnologyCostReduction);
                    return addCost(total, curReducedCost);
                }

                const costReduction = localPlanetState.lifeformTechnologyCostReduction;
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
                    planetId: planetData.id,
                    building,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostMsu,
                };
            }

            return best;
        };


        const bestItems: PotentialLifeformTechnologyCostReductionItem[] = [];
        while (true) {
            const bestItem =
                [...planetState.lifeformResearchBuildings, ...planetState.lifeformTechnologyBonusBuildings].reduce(
                    (best, cur) => potentialLifeformTechnologyCostReductionOrTechBonusBuildingReduceFunction(best, cur),
                    null as PotentialLifeformTechnologyCostReductionTechnologyResearchBuilding | PotentialLifeformTechnologyCostReductionTechnologyBonusBuilding | null,
                )
                ?? planetState.lifeformBuildingCostReductionBuildings.reduce(
                    (best, cur) => potentialLifeformTechnologyCostIndirectReductionBuildingReduceFunction(best, cur),
                    null as PotentialLifeformTechnologyCostReductionBuildingCostReductionBuilding | null,
                );

            if (bestItem == null) {
                break;
            }

            const newCostItem = {
                cost: bestItem.cost,
                level: bestItem.level,
                building: bestItem.building.type,
                planetId: bestItem.planetId,
            };

            localPlanetState.lifeformBuildingLevels[bestItem.building.type]++;

            if ('affectedBuildings' in bestItem.building) {
                const bestBuilding = bestItem.building;
                bestBuilding.affectedBuildings.forEach(affectedBuildingType => {
                    const additionalCostReduction = bestBuilding.getCostAndTimeReduction(affectedBuildingType, bestItem.level).cost
                        - bestBuilding.getCostAndTimeReduction(affectedBuildingType, bestItem.level - 1).cost;

                    localPlanetState.lifeformBuildingCostReduction[affectedBuildingType as LifeformBuildingType] += additionalCostReduction;
                });
            }
            else if ('getLifeformTechnologyResearchCostAndTimeReduction' in bestItem.building) {
                const additionalCostReduction = bestItem.building.getLifeformTechnologyResearchCostAndTimeReduction(bestItem.level).cost
                    - bestItem.building.getLifeformTechnologyResearchCostAndTimeReduction(bestItem.level - 1).cost;

                localPlanetState.lifeformTechnologyCostReduction += additionalCostReduction;
            }
            else {
                const additionalTechBonus = bestItem.building.getLifeformTechnologyBonus(bestItem.level)
                    - bestItem.building.getLifeformTechnologyBonus(bestItem.level - 1);

                localPlanetState.lifeformTechnologyBonus += additionalTechBonus;
            }

            costs.push(newCostItem);
            totalReducedCost = bestItem.newTotalReducedCost;
            totalReducedCostMsu = bestItem.newTotalReducedCostMsu;

            bestItems.push(bestItem);
        }

        const additionalLifeformBuildings = (costs.filter(c => 'building' in c) as (LifeformTechnologyAmortizationPartItem & { building: LifeformBuildingType; planetId: number })[])
            .map(c => ({
                building: c.building,
                level: c.level,
                planetId: c.planetId,

                // order: 1) cost reduction  2) tech bonus  3) lf research building
                order: AnyBuildingCostAndTimeReductionLifeformBuildings.some(b => b.type == c.building)
                    ? 1
                    : LifeformTechnologyBonusLifeformBuildings.some(b => b.type == c.building)
                        ? 2
                        : 3,
            })).sort((a, b) => {
                const orderDiff = a.order - b.order;
                if (orderDiff != 0) {
                    return orderDiff;
                }

                return a.level - b.level;
            });

        return {
            totalReducedCost,
            totalReducedCostMsu,
            newPlanetState: localPlanetState,
            additionalLifeformBuildings,
        };
    }

    #getLifeformBuildingAmortizationItems(): LifeformBuildingAmortizationItem[] {
        return Object.values(this.#state.planets).flatMap(
            planet => ResourceProductionBonusLifeformBuildingsByLifeform[planet.data.activeLifeform].map(
                lfBuilding => this.#getLifeformBuildingAmortizationItem(planet.data.id, lfBuilding)
            )
        );
    }
    #getLifeformBuildingAmortizationItem(planetId: number, lfBuilding: ResourceProductionBonusLifeformBuilding): LifeformBuildingAmortizationItem {
        const planetState = this.#state.planets[planetId];
        const planetData = planetState.data;
        const newLevel = planetData.lifeformBuildings[lfBuilding.type] + 1;

        const result = this.#getLifeformBuildingAmortizationItem_costReduction(planetState, lfBuilding);
        const reducedCost = result.totalReducedCost;
        const reducedCostMsu = result.totalReducedCostMsu;

        const additionalLifeformBuildings: LifeformBuildingLevels[] = [];
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

        let productionDelta: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
        let additionalProductionBonus: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
        ResourceTypes.forEach(resource => {
            const productionBreakdown = planetState.productionBreakdowns[resource];
            const newProductionBreakdown = productionBreakdown.clone();

            const additionalProductionBonusForResource = lfBuilding.getProductionBonus(newLevel)[resource] - lfBuilding.getProductionBonus(newLevel - 1)[resource];
            additionalProductionBonus[resource] += additionalProductionBonusForResource;
            newProductionBreakdown.lifeformBuildingBonus += additionalProductionBonusForResource;

            const productionDeltaValue = newProductionBreakdown.total - productionBreakdown.total;
            productionDelta = addCost(productionDelta, {
                metal: 0, crystal: 0, deuterium: 0, energy: 0,
                [resource]: productionDeltaValue,
            });
        });
        const productionDeltaMsu = this.#getMsu(productionDelta);

        return {
            type: 'lifeform-building',
            planetId,
            building: lfBuilding.type,
            level: newLevel,
            additionalLifeformBuildings,

            additionalProductionBonus,

            cost: reducedCost,
            costMsu: reducedCostMsu,
            productionDelta,
            productionDeltaMsu,
            timeInHours: reducedCostMsu / productionDeltaMsu,
        };
    }
    #getLifeformBuildingAmortizationItem_costReduction(planetState: AmortizationPlanetState, lfBuilding: ResourceProductionBonusLifeformBuilding) {
        interface PotentialLifeformBuildingCostReductionBuilding {
            building: AnyBuildingCostAndTimeReductionLifeformBuilding;
            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostMsu: number;
        }

        const planetData = planetState.data;

        const lifeformBuildingCostReductionBuildings = planetState.lifeformBuildingCostReductionBuildings;
        const lifeformBuildingCostReduction = { ...planetState.lifeformBuildingCostReduction };
        const lifeformBuildingLevels = { ...planetData.lifeformBuildings };

        const newLevel = planetData.lifeformBuildings[lfBuilding.type] + 1;

        const buildingCost = lfBuilding.getCost(newLevel);
        const reducedBuildingCost = multiplyCostInt(buildingCost, 1 - lifeformBuildingCostReduction[lfBuilding.type]);

        const costs: { building: LifeformBuildingType; level: number; cost: Cost }[] = [{
            building: lfBuilding.type,
            cost: buildingCost,
            level: newLevel,
        }];
        let totalReducedCost = reducedBuildingCost;
        let totalReducedCostMsu = this.#getMsu(reducedBuildingCost);

        const potentialLifeformReductionBuildingReduceFunction = (best: PotentialLifeformBuildingCostReductionBuilding | null, building: AnyBuildingCostAndTimeReductionLifeformBuilding) => {
            const newLevel = lifeformBuildingLevels[building.type] + 1;
            const cost = building.getCost(newLevel);
            const reducedCost = multiplyCostInt(cost, 1 - lifeformBuildingCostReduction[building.type]);

            const newTotalReducedCost = costs.reduce<Cost>((total, cur) => {
                const costReduction = lifeformBuildingCostReduction[cur.building];

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
                    building: building,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostMsu,
                };
            }

            return best;
        };

        while (true) {
            const bestBuilding = lifeformBuildingCostReductionBuildings.reduce<PotentialLifeformBuildingCostReductionBuilding | null>(potentialLifeformReductionBuildingReduceFunction, null);

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

                if (!LifeformBuildingTypes.includes(affectedBuildingType as LifeformBuildingType)) {
                    _throw(`affected building type ${affectedBuildingType} is not a lifeform building!`);
                }
                lifeformBuildingCostReduction[affectedBuildingType as LifeformBuildingType] += additionalCostReduction;
            });
        }

        const additionalLifeformBuildings = costs
            .filter(c => (LifeformBuildingTypes as AnyBuildingType[]).includes(c.building) && lfBuilding.type != c.building)
            .map(c => ({
                building: c.building as LifeformBuildingType,
                level: c.level,
                // order: 1) cost reduction buildings  2) lifeform production bonus building
                order: AnyBuildingCostAndTimeReductionLifeformBuildings.some(b => b.type == c.building)
                    ? 1
                    : 2,
            })).sort((a, b) => {
                const orderDiff = a.order - b.order;
                if (orderDiff != 0) {
                    return orderDiff;
                }

                return a.level - b.level;
            });

        return {
            totalReducedCost,
            totalReducedCostMsu,
            lifeformBuildingCostReduction,
            additionalLifeformBuildings,
        };
    }

    // #getAstrophysicsAmortizationItem(): AstrophysicsAmortizationItem {

    // }

    #getPlasmaTechnologyAmortizationItem(): PlasmaTechnologyAmortizationItem {
        const newLevel = this.#state.research[ResearchType.plasmaTechnology] + 1;

        const potentiallyReducedResult = this.#getPlasmaTechnologyAmortizationItem_costReduction();
        const reducedResearchCost = potentiallyReducedResult.totalReducedCost;
        const reducedResearchCostMsu = potentiallyReducedResult.totalReducedCostMsu;

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

        const additionalLifeformStuff: (LifeformTechnologyLevels | LifeformBuildingLevels)[] = [];
        const additionalLifeformStuffByPlanet: Record<number, Partial<Record<LifeformBuildingType, LifeformBuildingLevels> & Record<LifeformTechnologyType, LifeformTechnologyLevels>>> = {};
        potentiallyReducedResult.additionalLifeformBuildings.forEach(item => {
            const stuffByPlanet = (additionalLifeformStuffByPlanet[item.planetId] ??= {});

            let levels = stuffByPlanet[item.building];
            if (levels == null) {
                levels = {
                    planetId: item.planetId,
                    building: item.building,
                    levels: {
                        from: item.level,
                        to: item.level,
                    },
                };
                stuffByPlanet[item.building] = levels;
                additionalLifeformStuff.push(levels);
            }

            levels.levels.to = item.level;
        });

        potentiallyReducedResult.additionalLifeformTechnologies.forEach(item => {
            const stuffByPlanet = (additionalLifeformStuffByPlanet[item.planetId] ??= {});

            let levels = stuffByPlanet[item.technology];
            if (levels == null) {
                levels = {
                    planetId: item.planetId,
                    technology: item.technology,
                    levels: {
                        from: item.level,
                        to: item.level,
                    },
                };
                stuffByPlanet[item.technology] = levels;
                additionalLifeformStuff.push(levels);
            }

            levels.levels.to = item.level;
        });

        return {
            type: 'plasma-technology',
            level: newLevel,
            additionalLifeformStuff,

            cost: reducedResearchCost,
            costMsu: reducedResearchCostMsu,
            productionDelta,
            productionDeltaMsu,
            timeInHours: reducedResearchCostMsu / productionDeltaMsu,
        };
    }
    #getPlasmaTechnologyAmortizationItem_costReduction() {
        interface PotentialPlasmaTechnologyCostReductionItemBase {
            planetId: number;

            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostMsu: number;
        };
        type PotentialPlasmaTechnologyCostReductionTechnologyResearchBuilding = PotentialPlasmaTechnologyCostReductionItemBase & { building: LifeformTechnologyResearchBuilding };
        type PotentialPlasmaTechnologyCostReductionTechnologyBonusBuilding = PotentialPlasmaTechnologyCostReductionItemBase & { building: LifeformTechnologyBonusLifeformBuilding };
        type PotentialPlasmaTechnologyCostReductionBuildingCostReductionBuilding = PotentialPlasmaTechnologyCostReductionItemBase & { building: AnyBuildingCostAndTimeReductionLifeformBuilding };
        type PotentialPlasmaTechnologyCostReductionTechnology = PotentialPlasmaTechnologyCostReductionItemBase & { technology: ResearchCostAndTimeReductionLifeformTechnology };

        type PotentialPlasmaTechnologyCostReductionItem =
            | PotentialPlasmaTechnologyCostReductionTechnologyResearchBuilding
            | PotentialPlasmaTechnologyCostReductionTechnologyBonusBuilding
            | PotentialPlasmaTechnologyCostReductionBuildingCostReductionBuilding
            | PotentialPlasmaTechnologyCostReductionTechnology;

        type PlasmaTechAmortizationPartItem = {
            level: number;
            cost: Cost;
        } & (
                | { building: LifeformBuildingType; planetId: number }
                | { technology: LifeformTechnologyType; planetId: number }
                | { research: ResearchType.plasmaTechnology }
            );

        const newLevel = this.#state.research[ResearchType.plasmaTechnology] + 1;
        const currentPlasmaTechReduction = this.#state.totalPlasmaTechnologyCostReduction;
        const researchCost = PlasmaTechnology.getCost(newLevel);
        const reducedResearchCost = multiplyCostInt(researchCost, 1 - currentPlasmaTechReduction);

        const costs: PlasmaTechAmortizationPartItem[] = [{
            research: ResearchType.plasmaTechnology,
            cost: researchCost,
            level: newLevel,
        }];
        let totalReducedCost = reducedResearchCost;
        let totalReducedCostMsu = this.#getMsu(reducedResearchCost);



        const planetStates = Object.values(this.#state.planets);
        const localPlanetStates: Record<number, {
            id: number;
            lifeformTechnologyLevels: Record<LifeformTechnologyType, number>;
            lifeformBuildingLevels: Record<LifeformBuildingType, number>;
            lifeformBuildingCostReduction: Record<LifeformBuildingType, number>;
            lifeformTechnologyCostReduction: number;
            plasmaTechnologyCostReduction: number;
            lifeformTechnologyBonus: number;
        }> = {};
        const totalPlasmaTechnologyCostReduction = () => {
            return Object.values(localPlanetStates).reduce((total, planet) => {
                // apply tech bonuses from buildings and xp
                const planetPlasmaTechCostReduction = planet.plasmaTechnologyCostReduction;
                const planetTechBonus = planet.lifeformTechnologyBonus;
                const xpTechBonus = this.#state.lifeformExperienceBonus[this.#state.planets[planet.id].data.activeLifeform];

                return total + planetPlasmaTechCostReduction * (1 + planetTechBonus) * (1 + xpTechBonus);
            }, 0);
        };

        planetStates.forEach(planetState => {
            localPlanetStates[planetState.data.id] = {
                id: planetState.data.id,
                lifeformBuildingLevels: { ...planetState.data.lifeformBuildings },
                lifeformTechnologyLevels: { ...planetState.data.lifeformTechnologies },
                lifeformTechnologyCostReduction: planetState.lifeformTechnologyCostReduction,
                lifeformBuildingCostReduction: { ...planetState.lifeformBuildingCostReduction },
                plasmaTechnologyCostReduction: planetState.plasmaTechnologyCostReduction,
                lifeformTechnologyBonus: planetState.lifeformTechnologyBonus,
            };
        });

        // find the next best item from each planet: 
        //  - lf plasma tech reduction technology (to reduce cost of plasma technology)
        const potentialPlasmaTechCostReductionTechnologyReduceFunction = (
            best: PotentialPlasmaTechnologyCostReductionTechnology | null,
            technology: ResearchCostAndTimeReductionLifeformTechnology,
            planetId: number,
        ): PotentialPlasmaTechnologyCostReductionTechnology | null => {
            const localPlanetState = localPlanetStates[planetId];

            const newLevel = localPlanetState.lifeformTechnologyLevels[technology.type] + 1;
            const cost = technology.getCost(newLevel);
            const reducedCost = multiplyCostInt(cost, 1 - localPlanetState.lifeformTechnologyCostReduction);
            const costReduction = totalPlasmaTechnologyCostReduction();

            const newTotalReducedCost = costs.reduce<Cost>((total, cur) => {
                // if building or technology -> apply already active reduction 
                if ('building' in cur) {
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - localPlanetState.lifeformBuildingCostReduction[cur.building]);
                    return addCost(total, curReducedCost);
                }
                if ('technology' in cur) {
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - localPlanetState.lifeformTechnologyCostReduction);
                    return addCost(total, curReducedCost);
                }

                // include tech bonuses from buildings and xp
                const planetTechBonus = localPlanetState.lifeformTechnologyBonus;
                const xpTechBonus = this.#state.lifeformExperienceBonus[this.#state.planets[planetId].data.activeLifeform];

                const additionalCostReduction = technology.getResearchCostAndTimeReduction(cur.research, newLevel).cost
                    - technology.getResearchCostAndTimeReduction(cur.research, newLevel - 1).cost;

                const newCostReduction = costReduction + additionalCostReduction * (1 + planetTechBonus) * (1 + xpTechBonus);
                const curReducedCost = multiplyCostInt(cur.cost, 1 - newCostReduction);

                return addCost(total, curReducedCost);
            }, reducedCost);

            const newTotalReducedCostMsu = this.#getMsu(newTotalReducedCost);

            if (newTotalReducedCostMsu <= totalReducedCostMsu && (best == null || newTotalReducedCostMsu < best.newTotalReducedCostMsu)) {
                return {
                    planetId,
                    technology,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostMsu,
                };
            }

            return best;
        };

        //  - lf research building (to reduce cost of reduction lf technology) A
        //    OR lf technology bonus building (to increase cost reduction bonus of reduction tech) A
        const potentialPlasmaTechCostReductionOrTechBonusBuildingReduceFunction = (
            best: PotentialPlasmaTechnologyCostReductionTechnologyResearchBuilding | PotentialPlasmaTechnologyCostReductionTechnologyBonusBuilding | null,
            building: LifeformTechnologyResearchBuilding | LifeformTechnologyBonusLifeformBuilding,
            planetId: number,
        ): PotentialPlasmaTechnologyCostReductionTechnologyResearchBuilding | PotentialPlasmaTechnologyCostReductionTechnologyBonusBuilding | null => {
            const localPlanetState = localPlanetStates[planetId];

            const newLevel = localPlanetState.lifeformBuildingLevels[building.type] + 1;
            const cost = building.getCost(newLevel);
            const reducedCost = multiplyCostInt(cost, 1 - localPlanetState.lifeformBuildingCostReduction[building.type]);

            let additionalCostReduction = 0;
            let additionalTechBonus = 0;
            if ('getLifeformTechnologyResearchCostAndTimeReduction' in building) {
                additionalCostReduction = building.getLifeformTechnologyResearchCostAndTimeReduction(newLevel).cost
                    - building.getLifeformTechnologyResearchCostAndTimeReduction(newLevel - 1).cost;
            } else {
                additionalTechBonus = building.getLifeformTechnologyBonus(newLevel) - building.getLifeformTechnologyBonus(newLevel - 1);
            }
            const newTotalReducedCost = costs.reduce<Cost>((total, cur) => {
                // if building or plasmatech -> apply already active reduction 
                if ('research' in cur) {
                    const plasmaTechCostReduction = Object.values(localPlanetStates).reduce(
                        (total, planet) => {
                            // include tech bonuses from buildings and xp
                            const planetPlasmaTechCostReduction = planet.plasmaTechnologyCostReduction;
                            const planetTechBonus = planet.lifeformTechnologyBonus + (planet.id == planetId ? additionalTechBonus : 0);
                            const xpTechBonus = this.#state.lifeformExperienceBonus[this.#state.planets[planetId].data.activeLifeform];

                            return total + planetPlasmaTechCostReduction * (1 + planetTechBonus) * (1 + xpTechBonus);
                        },
                        0
                    );
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - plasmaTechCostReduction);
                    return addCost(total, curReducedCost);
                }
                if ('building' in cur) {
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - localPlanetState.lifeformBuildingCostReduction[cur.building]);
                    return addCost(total, curReducedCost);
                }

                const newCostReduction = localPlanetState.lifeformTechnologyCostReduction + additionalCostReduction;
                const curReducedCost = multiplyCostInt(cur.cost, 1 - newCostReduction);

                return addCost(total, curReducedCost);
            }, reducedCost);

            const newTotalReducedCostMsu = this.#getMsu(newTotalReducedCost);

            if (newTotalReducedCostMsu <= totalReducedCostMsu && (best == null || newTotalReducedCostMsu < best.newTotalReducedCostMsu)) {
                const resultBase: PotentialPlasmaTechnologyCostReductionItemBase = {
                    planetId,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostMsu,
                };

                // Typescript compiler throws error otherwise (update/upgrade needed?)
                if ('getLifeformTechnologyResearchCostAndTimeReduction' in building) {
                    return {
                        ...resultBase,
                        building,
                    };
                } else {
                    return {
                        ...resultBase,
                        building,
                    };
                }
            }

            return best;
        };

        //  - lf building cost reduction building (to reduce cost of lf buildings above with A)
        const potentialPlasmaTechCostIndirectReductionBuildingReduceFunction = (
            best: PotentialPlasmaTechnologyCostReductionBuildingCostReductionBuilding | null,
            building: AnyBuildingCostAndTimeReductionLifeformBuilding,
            planetId: number,
        ): PotentialPlasmaTechnologyCostReductionBuildingCostReductionBuilding | null => {
            const localPlanetState = localPlanetStates[planetId];

            const newLevel = localPlanetState.lifeformBuildingCostReduction[building.type] + 1;
            const cost = building.getCost(newLevel);
            const reducedCost = multiplyCostInt(cost, 1 - localPlanetState.lifeformBuildingCostReduction[building.type]);

            const newTotalReducedCost = costs.reduce<Cost>((total, cur) => {
                // if plasmaTech-research or technology -> apply already active reduction 
                if ('research' in cur) {
                    const plasmaTechCostReduction = Object.values(localPlanetStates).reduce(
                        (total, planet) => {
                            // include tech bonuses from buildings and xp
                            const planetPlasmaTechCostReduction = planet.plasmaTechnologyCostReduction;
                            const planetTechBonus = planet.lifeformTechnologyBonus;
                            const xpTechBonus = this.#state.lifeformExperienceBonus[this.#state.planets[planetId].data.activeLifeform];

                            return total + planetPlasmaTechCostReduction * (1 + planetTechBonus) * (1 + xpTechBonus);
                        },
                        0
                    );
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - plasmaTechCostReduction);
                    return addCost(total, curReducedCost);
                }
                if ('technology' in cur) {
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - localPlanetState.lifeformTechnologyCostReduction);
                    return addCost(total, curReducedCost);
                }

                const costReduction = localPlanetState.lifeformTechnologyCostReduction;
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
                    planetId,
                    building,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostMsu,
                };
            }

            return best;
        };

        const potentialPlasmaTechCostReductionItemReduceFunctions = (
            best: PotentialPlasmaTechnologyCostReductionItem | null,
            planetState: AmortizationPlanetState,
        ): PotentialPlasmaTechnologyCostReductionItem | null => {
            const bestPlanetItem: PotentialPlasmaTechnologyCostReductionItem | null =
                // - lf plasma tech reduction technology (to reduce cost of plasma technology)
                planetState.plasmaTechnologyCostReductionTechnologies.reduce(
                    (best, cur) => potentialPlasmaTechCostReductionTechnologyReduceFunction(best, cur, planetState.data.id),
                    null as PotentialPlasmaTechnologyCostReductionTechnology | null,
                )
                // - lf research building (to reduce cost of reduction lf technology) A
                //   OR lf technology bonus building (to increase cost reduction bonus of reduction tech) A
                ?? [...planetState.lifeformResearchBuildings, ...planetState.lifeformTechnologyBonusBuildings].reduce(
                    (best, cur) => potentialPlasmaTechCostReductionOrTechBonusBuildingReduceFunction(best, cur, planetState.data.id),
                    null as PotentialPlasmaTechnologyCostReductionTechnologyResearchBuilding | PotentialPlasmaTechnologyCostReductionTechnologyBonusBuilding | null,
                )
                // - lf building cost reduction building (to reduce cost of lf buildings above with A)
                ?? planetState.lifeformBuildingCostReductionBuildings.reduce(
                    (best, cur) => potentialPlasmaTechCostIndirectReductionBuildingReduceFunction(best, cur, planetState.data.id),
                    null as PotentialPlasmaTechnologyCostReductionBuildingCostReductionBuilding | null,
                );

            if (bestPlanetItem == null) {
                return best;
            }

            if (bestPlanetItem.newTotalReducedCostMsu <= totalReducedCostMsu && (best == null || bestPlanetItem.newTotalReducedCostMsu < best.newTotalReducedCostMsu)) {
                return bestPlanetItem;
            }

            return best;
        };

        const bestItems: PotentialPlasmaTechnologyCostReductionItem[] = [];
        while (true) {
            const bestItem = planetStates.reduce(potentialPlasmaTechCostReductionItemReduceFunctions, null);

            if (bestItem == null) {
                break;
            }

            const localPlanetState = localPlanetStates[bestItem.planetId];
            let newCostItem: PlasmaTechAmortizationPartItem;
            if ('building' in bestItem) {
                newCostItem = {
                    cost: bestItem.cost,
                    level: bestItem.level,
                    building: bestItem.building.type,
                    planetId: bestItem.planetId,
                };

                localPlanetState.lifeformBuildingLevels[bestItem.building.type]++;

                if ('affectedBuildings' in bestItem.building) {
                    const bestBuilding = bestItem.building;
                    bestBuilding.affectedBuildings.forEach(affectedBuildingType => {
                        const additionalCostReduction = bestBuilding.getCostAndTimeReduction(affectedBuildingType, bestItem.level).cost
                            - bestBuilding.getCostAndTimeReduction(affectedBuildingType, bestItem.level - 1).cost;

                        localPlanetState.lifeformBuildingCostReduction[affectedBuildingType as LifeformBuildingType] += additionalCostReduction;
                    });
                }
                else if ('getLifeformTechnologyResearchCostAndTimeReduction' in bestItem.building) {
                    const additionalCostReduction = bestItem.building.getLifeformTechnologyResearchCostAndTimeReduction(bestItem.level).cost
                        - bestItem.building.getLifeformTechnologyResearchCostAndTimeReduction(bestItem.level - 1).cost;

                    localPlanetState.lifeformTechnologyCostReduction += additionalCostReduction;
                }
                else {
                    const additionalTechBonus = bestItem.building.getLifeformTechnologyBonus(bestItem.level)
                        - bestItem.building.getLifeformTechnologyBonus(bestItem.level - 1);

                    localPlanetState.lifeformTechnologyBonus += additionalTechBonus;
                }
            }
            else {
                newCostItem = {
                    cost: bestItem.cost,
                    level: bestItem.level,
                    technology: bestItem.technology.type,
                    planetId: bestItem.planetId,
                };

                localPlanetState.lifeformTechnologyLevels[bestItem.technology.type]++;
                localPlanetState.plasmaTechnologyCostReduction += bestItem.technology.getResearchCostAndTimeReduction(ResearchType.plasmaTechnology, bestItem.level).cost
                    - bestItem.technology.getResearchCostAndTimeReduction(ResearchType.plasmaTechnology, bestItem.level - 1).cost;
            }

            costs.push(newCostItem);
            totalReducedCost = bestItem.newTotalReducedCost;
            totalReducedCostMsu = bestItem.newTotalReducedCostMsu;

            bestItems.push(bestItem);
        }


        const additionalLifeformBuildings = (costs.filter(c => 'building' in c) as (PlasmaTechAmortizationPartItem & { building: LifeformBuildingType; planetId: number })[])
            .map(c => ({
                building: c.building,
                level: c.level,
                planetId: c.planetId,

                // order: 1) cost reduction  2) tech bonus  3) lf research building
                order: AnyBuildingCostAndTimeReductionLifeformBuildings.some(b => b.type == c.building)
                    ? 1
                    : LifeformTechnologyBonusLifeformBuildings.some(b => b.type == c.building)
                        ? 2
                        : 3,
            })).sort((a, b) => {
                const orderDiff = a.order - b.order;
                if (orderDiff != 0) {
                    return orderDiff;
                }

                return a.level - b.level;
            }).map(c => ({
                building: c.building,
                level: c.level,
                planetId: c.planetId,
            }));

        const additionalLifeformTechnologies = (costs.filter(c => 'technology' in c) as (PlasmaTechAmortizationPartItem & { technology: LifeformTechnologyType; planetId: number })[])
            .map(c => ({
                technology: c.technology,
                level: c.level,
                planetId: c.planetId,
            })).sort((a, b) => {
                const idDiff = a.technology - b.technology;
                if (idDiff != 0) {
                    return idDiff;
                }
                return a.level - b.level;
            });

        return {
            totalReducedCost,
            totalReducedCostMsu,
            newPlanetStates: localPlanetStates,
            additionalLifeformBuildings,
            additionalLifeformTechnologies,
        };
    }


    #getMineAmortizationItems(): MineAmortizationItem[] {
        return Object.values(this.#settings.planets).flatMap(
            planet => $mineBuildingTypes.map(
                mineType => this.#getMineAmortizationItem(planet.id, mineType)
            )
        );
    }
    #getMineAmortizationItem(planetId: number, mineType: MineBuildingType): MineAmortizationItem {
        const planetState = this.#state.planets[planetId];
        const planetData = planetState.data;
        const newLevel = planetData.buildings[mineType] + 1;
        const mine = $minesByType[mineType];

        const result = this.#getMineAmortizationItem_costReduction(planetState, mineType);
        const reducedCost = result.totalReducedCost;
        const reducedCostMsu = result.totalReducedCostMsu;
        const additionalLifeformBuildings: LifeformBuildingLevels[] = [];

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

            cost: reducedCost,
            costMsu: reducedCostMsu,
            productionDelta,
            productionDeltaMsu,
            timeInHours: reducedCostMsu / productionDeltaMsu,
        };
    }
    #getMineAmortizationItem_costReduction(planetState: AmortizationPlanetState, mineType: MineBuildingType) {
        interface PotentialMineCostReductionBuilding {
            building: AnyBuildingCostAndTimeReductionLifeformBuilding;
            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostMsu: number;
        }

        const planetData = planetState.data;

        const mineCostReductionBuildings = planetState.mineCostReductionBuildings;

        let mineCostReduction = { ...planetState.mineCostReductions };
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
                    : lifeformBuildingCostReduction[cur.building as LifeformBuildingType];

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
                    mineCostReduction[affectedBuildingType as MineBuildingType] += additionalCostReduction;
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