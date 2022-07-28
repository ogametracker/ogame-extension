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
import { AnyBuildingCostAndTimeReductionLifeformBuilding, AnyBuildingType, LifeformTechnologyBonusLifeformBuilding, LifeformTechnologyResearchBuilding, ResourceProductionBonusLifeformBuilding } from "@/shared/models/ogame/lifeforms/buildings/interfaces";
import { AnyBuildingCostAndTimeReductionLifeformBuildings, AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform, LifeformTechnologyBonusLifeformBuildings, LifeformTechnologyBonusLifeformBuildingsByLifeform, LifeformTechnologyResearchBuildings, LifeformTechnologyResearchBuildingsByLifeform, ResourceProductionBonusLifeformBuildingsByLifeform } from "@/shared/models/ogame/lifeforms/buildings/LifeformBuildings";
import { getLifeformTechnologyBonus } from "@/shared/models/ogame/lifeforms/experience";
import { LifeformBuildingType, LifeformBuildingTypes } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { LifeformType, LifeformTypes } from "@/shared/models/ogame/lifeforms/LifeformType";
import { CollectorClassBonusLifeformTechnology, CrawlerProductionBonusAndConsumptionReductionLifeformTechnology, ResearchCostAndTimeReductionLifeformTechnology, ResourceProductionBonusLifeformTechnology } from "@/shared/models/ogame/lifeforms/technologies/interfaces";
import { CollectorClassBonusLifeformTechnologies, CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies, ResearchCostAndTimeReductionLifeformTechnologies, ResourceProductionBonusLifeformTechnologies } from "@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies";
import { hasCommandStaff } from "@/shared/models/ogame/premium/hasCommandStaff";
import { Astrophysics } from "@/shared/models/ogame/research/Astrophysics";
import { PlasmaTechnology } from "@/shared/models/ogame/research/PlasmaTechnology";
import { ResearchType, } from "@/shared/models/ogame/research/ResearchType";
import { getCrystalBaseProduction } from "@/shared/models/ogame/resource-production/getCrystalProduction";
import { getItemBonus } from "@/shared/models/ogame/resource-production/getItemBonus";
import { getMetalBaseProduction } from "@/shared/models/ogame/resource-production/getMetalProduction";
import { EmpireProductionBreakdown, EmpireProductionPlanetState } from "@/shared/models/ogame/resource-production/types";
import { ResourceType, ResourceTypes } from "@/shared/models/ogame/resources/ResourceType";
import { ShipType } from "@/shared/models/ogame/ships/ShipType";
import { ServerSettings } from "@/shared/models/server-settings/ServerSettings";
import { createRecord } from "@/shared/utils/createRecord";
import { __measure } from "@/shared/utils/performance/__measure";
import { _throw } from "@/shared/utils/_throw";
import { AmortizationAstrophysicsSettings } from "./AmortizationAstrophysicsSettings";
import { AmortizationPlanetSettings } from "./AmortizationPlanetSettings";
import { AmortizationPlayerSettings } from "./AmortizationPlayerSettings";
import { AmortizationItem, AstrophysicsAmortizationItem, LifeformBuildingAmortizationItem, LifeformBuildingLevels, LifeformTechnologyAmortizationItem, LifeformTechnologyLevels, MineAmortizationItem, MineBuildingType, PlasmaTechnologyAmortizationItem } from "./models";


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
interface EmpireProductionBreakdowns extends Record<ResourceType, EmpireProductionBreakdown> {
    setPlasmaTechnologyLevel(level: number): void;
    getTotal(): Cost;
    clone(): EmpireProductionBreakdowns;
}

interface AmortizationPlanetState {
    data: PlanetData;

    lifeformExperienceBoost: number;
    productionBuildingDependencies: ProductionBuildingDependencies;

    mineCostReductions: Record<MineBuildingType, number>;
    mineCostReductionBuildings: AnyBuildingCostAndTimeReductionLifeformBuilding[];

    lifeformBuildingCostReductions: Record<LifeformBuildingType, number>;
    lifeformBuildingCostReductionBuildings: AnyBuildingCostAndTimeReductionLifeformBuilding[];

    plasmaTechnologyCostReduction: number;
    plasmaTechnologyCostReductionTechnologies: ResearchCostAndTimeReductionLifeformTechnology[];

    lifeformTechnologyCostReduction: number;
    lifeformTechnologyResearchBuildings: LifeformTechnologyResearchBuilding[];

    lifeformResourceProductionBonusBuildings: ResourceProductionBonusLifeformBuilding[];

    lifeformTechnologyBoost: number;
    lifeformTechnologyBoostBuildings: LifeformTechnologyBonusLifeformBuilding[];

    collectorClassBonusTechnologies: CollectorClassBonusLifeformTechnology[];
    lifeformResourceProductionBonusTechnologies: ResourceProductionBonusLifeformTechnology[];
    crawlerProductionBonusTechnologies: CrawlerProductionBonusAndConsumptionReductionLifeformTechnology[];
}

interface AmortizationItemGeneratorState {
    planets: Record<number, AmortizationPlanetState>;
    productionBreakdowns: EmpireProductionBreakdowns;
    research: Record<ResearchType, number>;

    get totalPlasmaTechnologyCostReduction(): number;
}

/* This class generates the next best amortizations items based on the settings provided.
 * Please don't a take a deep look into its code, it is awful.
 */
export class AmortizationItemGenerator {
    readonly #settings: AmortizationGenerationSettings;
    readonly #playerData: LocalPlayerData;
    readonly #serverSettings: ServerSettings;

    #generator: Generator<AmortizationItem, void, unknown> | null = null;
    readonly #state: AmortizationItemGeneratorState = {
        get totalPlasmaTechnologyCostReduction() {
            return Object.values(this.planets).reduce(
                (total, planet) => total + planet.plasmaTechnologyCostReduction * (1 + planet.lifeformTechnologyBoost) * (1 + planet.lifeformExperienceBoost),
                0,
            );
        },
    } as AmortizationItemGeneratorState;

    public constructor(settings: AmortizationGenerationSettings, playerData: LocalPlayerData, serverSettings: ServerSettings) {
        this.#settings = settings;
        this.#playerData = playerData;
        this.#serverSettings = serverSettings;
    }

    public nextItem(): AmortizationItem | null {
        const generator = this.#generator ?? this.#initGenerator();

        const result = __measure('generate next amortization item', () => generator.next());
        if (result.done) {
            return null;
        }

        return result.value;
    }

    #initGenerator(): Generator<AmortizationItem, void, unknown> {
        const generator = this.#generateNextItem();

        const planets = Object.values(this.#settings.planets);
        const planetStates: Record<number, AmortizationPlanetState> = {};
        planets.forEach(planet => {
            const planetData = this.#init_getPlanetData(planet);

            const lifeformResourceProductionBonusBuildings = ResourceProductionBonusLifeformBuildingsByLifeform[planet.lifeform];

            // lf building cost reduction
            const lifeformBuildingCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform];

            // mine cost reduction
            const mineCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform]
                .filter(b => $mineBuildingTypes.some(mineType => b.appliesTo(mineType)));

            // plasma tech cost reduction
            const plasmaTechnologyCostReductionTechnologies = ResearchCostAndTimeReductionLifeformTechnologies.filter(
                tech => planet.activeLifeformTechnologies.includes(tech.type)
                    && tech.appliesTo(ResearchType.plasmaTechnology)
            );

            // lf research buildings
            const lifeformTechnologyResearchBuildings = LifeformTechnologyResearchBuildingsByLifeform[planet.lifeform];

            // collector class bonuses
            const collectorClassBonusTechnologies = CollectorClassBonusLifeformTechnologies.filter(
                tech => planet.activeLifeformTechnologies.includes(tech.type)
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

            const productionBuildingDependencies: ProductionBuildingDependencies = {
                planet: {
                    position: planetData.coordinates.position,
                    temperature: planetData.maxTemperature,
                },
                serverSettings: {
                    economySpeed: this.#serverSettings.speed.economy,
                    crystalBoost: {
                        default: this.#serverSettings.resourceProduction.productionFactorBonus.crystal.default,
                        pos1: this.#serverSettings.resourceProduction.productionFactorBonus.crystal.pos1,
                        pos2: this.#serverSettings.resourceProduction.productionFactorBonus.crystal.pos2,
                        pos3: this.#serverSettings.resourceProduction.productionFactorBonus.crystal.pos3,
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
                : getLifeformTechnologyBonus(this.#playerData.lifeformExperience[planet.lifeform]);

            planetStates[planet.id] = {
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
            };
        });

        const researchLevels = {
            [ResearchType.plasmaTechnology]: this.#settings.player.levelPlasmaTechnology,
            [ResearchType.astrophysics]: this.#settings.player.levelAstrophysics,
        } as Record<ResearchType, number>;

        const lifeformExperienceBonus = createRecord(LifeformTypes, lf => lf == LifeformType.none ? 0 : getLifeformTechnologyBonus(this.#playerData.lifeformExperience[lf]));

        const empireProductionPlanetStates = {
            metal: {} as Record<number, EmpireProductionPlanetState>,
            crystal: {} as Record<number, EmpireProductionPlanetState>,
            deuterium: {} as Record<number, EmpireProductionPlanetState>,
        };
        planets.forEach(_ => {
            const planetId = _.id;
            const planetState = planetStates[planetId];

            const levelMetalMine = planetState.data.buildings[BuildingType.metalMine];
            const levelCrystalMine = planetState.data.buildings[BuildingType.crystalMine];
            const levelDeuteriumSynthesizer = planetState.data.buildings[BuildingType.deuteriumSynthesizer];
            const totalMineLevel = levelMetalMine + levelCrystalMine + levelDeuteriumSynthesizer;

            const crawlerConfig = {
                available: planetState.data.ships[ShipType.crawler],
                percentage: planetState.data.productionSettings[ShipType.crawler],
                totalMineLevel,
            };

            const baseProductionConfig = {
                crawlers: crawlerConfig,
                lifeformExperienceBoost: lifeformExperienceBonus[planetState.data.activeLifeform],
                collectorClassBonusFactor: this.#get_planetCollectorClassBonusFactor(planetState),
                lifeformBuildingBonusProductionFactor: this.#get_planetLifeformBuildingBonusProductionFactor(planetState),
                lifeformTechnologyBonusProductionFactor: this.#get_planetLifeformTechnologyBonusProductionFactor(planetState),
                lifeformTechnologyCrawlerProductionBonusFactor: this.#get_planetLifeformTechnologyCrawlerProductionBonusFactor(planetState),
                lifeformTechnologyBoost: this.#get_planetLifeformTechnologyBoost(planetState),
            };

            empireProductionPlanetStates.metal[planetId] = {
                baseProduction: getMetalBaseProduction({
                    planetPosition: planetState.data.coordinates.position,
                    serverEconomySpeed: this.#serverSettings.speed.economy,
                }),
                mineProduction: MetalMine.getProduction(levelMetalMine, planetState.productionBuildingDependencies),
                itemBonusProductionFactor: getItemBonus(ResourceType.metal, planetState.data.activeItems),
                ...baseProductionConfig,
                lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.metal,
                lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.metal,
            };
            empireProductionPlanetStates.crystal[planetId] = {
                baseProduction: getCrystalBaseProduction({
                    planetPosition: planetState.data.coordinates.position,
                    serverEconomySpeed: this.#serverSettings.speed.economy,
                    serverPositionBoost: this.#serverSettings.resourceProduction.productionFactorBonus.crystal,
                }),
                mineProduction: CrystalMine.getProduction(levelCrystalMine, planetState.productionBuildingDependencies),
                itemBonusProductionFactor: getItemBonus(ResourceType.crystal, planetState.data.activeItems),
                ...baseProductionConfig,
                lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.crystal,
                lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.crystal,
            };
            empireProductionPlanetStates.deuterium[planetId] = {
                baseProduction: 0,
                mineProduction: DeuteriumSynthesizer.getProduction(levelDeuteriumSynthesizer, planetState.productionBuildingDependencies),
                itemBonusProductionFactor: getItemBonus(ResourceType.deuterium, planetState.data.activeItems),
                ...baseProductionConfig,
                lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.deuterium,
                lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.deuterium,
            };
        });

        const serverSettings = {
            collectorProductionFactor: this.#serverSettings.playerClasses.collector.productionFactorBonus,
            geologistActiveCrawlerFactorBonus: this.#serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
            collectorCrawlerProductionFactorBonus: this.#serverSettings.playerClasses.collector.crawlers.productionFactorBonus,
            crawlerProductionFactorPerUnit: this.#serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit,
            crawlerMaxProductionFactor: this.#serverSettings.playerClasses.crawlers.maxProductionFactor,
        };

        // init production breakdowns
        const productionBreakdowns: EmpireProductionBreakdowns = {
            metal: new EmpireProductionBreakdown(
                ResourceType.metal,
                researchLevels[ResearchType.plasmaTechnology],
                this.#settings.player.playerClass,
                this.#settings.player.allianceClass,
                this.#settings.player.officers.geologist,
                hasCommandStaff(this.#settings.player.officers),
                serverSettings,
                empireProductionPlanetStates.metal,
            ),
            crystal: new EmpireProductionBreakdown(
                ResourceType.crystal,
                researchLevels[ResearchType.plasmaTechnology],
                this.#settings.player.playerClass,
                this.#settings.player.allianceClass,
                this.#settings.player.officers.geologist,
                hasCommandStaff(this.#settings.player.officers),
                serverSettings,
                empireProductionPlanetStates.crystal,
            ),
            deuterium: new EmpireProductionBreakdown(
                ResourceType.deuterium,
                researchLevels[ResearchType.plasmaTechnology],
                this.#settings.player.playerClass,
                this.#settings.player.allianceClass,
                this.#settings.player.officers.geologist,
                hasCommandStaff(this.#settings.player.officers),
                serverSettings,
                empireProductionPlanetStates.deuterium,
            ),

            getTotal(): Cost {
                return {
                    metal: this.metal.getTotal(),
                    crystal: this.crystal.getTotal(),
                    deuterium: this.deuterium.getTotal(),
                    energy: 0,
                };
            },
            setPlasmaTechnologyLevel(level: number) {
                this.metal.plasmaTechnologyLevel = level;
                this.crystal.plasmaTechnologyLevel = level;
                this.deuterium.plasmaTechnologyLevel = level;
            },
            clone() {
                return {
                    metal: this.metal.clone(),
                    crystal: this.crystal.clone(),
                    deuterium: this.deuterium.clone(),
                    setPlasmaTechnologyLevel: this.setPlasmaTechnologyLevel,
                    getTotal: this.getTotal,
                    clone: this.clone,
                };
            },
        };

        this.#state.planets = planetStates;
        this.#state.research = researchLevels;
        this.#state.productionBreakdowns = productionBreakdowns;

        return this.#generator = generator;
    }

    #get_planetCollectorClassBonusFactor(planetState: AmortizationPlanetState) {
        return planetState.collectorClassBonusTechnologies.reduce(
            (total, tech) => total + tech.getCollectorClassBonus(planetState.data.lifeformTechnologies[tech.type] ?? 0),
            0
        );
    }
    #get_planetLifeformTechnologyBoost(planetState: AmortizationPlanetState) {
        return planetState.lifeformTechnologyBoostBuildings.reduce(
            (total, building) => total + building.getLifeformTechnologyBonus(planetState.data.lifeformBuildings[building.type]),
            0
        );
    }
    #get_planetLifeformTechnologyCrawlerProductionBonusFactor(planetState: AmortizationPlanetState) {
        return planetState.crawlerProductionBonusTechnologies.reduce(
            (total, tech) => total + tech.getCrawlerProductionBonus(planetState.data.lifeformTechnologies[tech.type]),
            0
        );
    }
    #get_planetLifeformBuildingBonusProductionFactor(planetState: AmortizationPlanetState): Cost {
        return planetState.lifeformResourceProductionBonusBuildings.reduce<Cost>(
            (total, building) => addCost(total, building.getProductionBonus(planetState.data.lifeformBuildings[building.type])),
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );
    }
    #get_planetLifeformTechnologyBonusProductionFactor(planetState: AmortizationPlanetState): Cost {
        return planetState.lifeformResourceProductionBonusTechnologies.reduce<Cost>(
            (total, tech) => addCost(total, tech.getProductionBonus(planetState.data.lifeformTechnologies[tech.type])),
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );
    }
    #init_getPlanetData(planet: AmortizationPlanetSettings): PlanetData {
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
            lifeformBuildings: {
                ...(planet.lifeformBuildingLevels ?? createRecord(LifeformBuildingTypes, 0)),
                ...(createRecord(LifeformTechnologyResearchBuildings.map(b => b.type), 1)), // assume level 1 for lf research buildings
            },
            lifeformTechnologies: { ...(planet.lifeformTechnologyLevels ?? createRecord(LifeformTechnologyTypes, 0)) },
            maxTemperature: planet.maxTemperature,
            productionSettings: {
                [BuildingType.metalMine]: 100,
                [BuildingType.crystalMine]: 100,
                [BuildingType.deuteriumSynthesizer]: 100,
                [ShipType.crawler]: planet.crawlers.overload ? 150 : 100,
            } as ProductionSettings,
            ships: {
                [ShipType.crawler]: planet.crawlers.enabled ? planet.crawlers.max ? 10000 : planet.crawlers.count : 0,
            } as PlanetShipCount,
        };
    }

    #updateState() {
        const levelPlasmaTechnology = this.#state.research[ResearchType.plasmaTechnology];
        this.#state.productionBreakdowns.setPlasmaTechnologyLevel(levelPlasmaTechnology);

        ResourceTypes.forEach(resource => {
            const productionBreakdown = this.#state.productionBreakdowns[resource];

            const mine = {
                metal: MetalMine,
                crystal: CrystalMine,
                deuterium: DeuteriumSynthesizer,
            }[resource];
            const mineType = mine.type as MineBuildingType;

            Object.values(this.#state.planets).forEach(planetState => {
                const planetData = planetState.data;

                // update production
                {
                    const empireProductionState = productionBreakdown.planets[planetData.id];

                    // update mine production
                    empireProductionState.mineProduction = mine.getProduction(planetData.buildings[mineType], planetState.productionBuildingDependencies);

                    // update lifeform-related bonuses
                    empireProductionState.lifeformBuildingBonusProductionFactor = this.#get_planetLifeformBuildingBonusProductionFactor(planetState)[resource];

                    empireProductionState.collectorClassBonusFactor = this.#get_planetCollectorClassBonusFactor(planetState);
                    empireProductionState.lifeformTechnologyBonusProductionFactor = this.#get_planetLifeformTechnologyBonusProductionFactor(planetState)[resource];

                    empireProductionState.lifeformTechnologyCrawlerProductionBonusFactor = this.#get_planetLifeformTechnologyCrawlerProductionBonusFactor(planetState);
                    empireProductionState.crawlers.totalMineLevel = $mineBuildingTypes.reduce((total, mineType) => total + planetData.buildings[mineType], 0);

                    empireProductionState.lifeformTechnologyBoost = this.#get_planetLifeformTechnologyBoost(planetState);
                }

                // update lifeform building cost reduction
                LifeformBuildingTypes.forEach(building => {
                    planetState.lifeformBuildingCostReductions[building] = planetState.lifeformBuildingCostReductionBuildings.reduce(
                        (total, costReductionBuilding) => total + costReductionBuilding.getCostAndTimeReduction(building, planetData.lifeformBuildings[costReductionBuilding.type]).cost,
                        0,
                    );
                });

                // update lifeform technology cost reduction
                planetState.lifeformTechnologyCostReduction = planetState.lifeformTechnologyResearchBuildings.reduce(
                    (total, researchBuilding) => total + researchBuilding.getLifeformTechnologyResearchCostAndTimeReduction(planetData.lifeformBuildings[researchBuilding.type]).cost,
                    0,
                );

                // update mine cost reduction
                $mineBuildingTypes.forEach(mine => {
                    planetState.mineCostReductions[mine] = planetState.mineCostReductionBuildings.reduce(
                        (total, costReductionBuilding) => total + costReductionBuilding.getCostAndTimeReduction(mine, planetData.lifeformBuildings[costReductionBuilding.type]).cost,
                        0,
                    );
                });

                // update plasmatech cost reduction
                planetState.plasmaTechnologyCostReduction = planetState.plasmaTechnologyCostReductionTechnologies.reduce(
                    (total, costReductionTech) => total + costReductionTech.getResearchCostAndTimeReduction(ResearchType.plasmaTechnology, planetData.lifeformTechnologies[costReductionTech.type]).cost,
                    0,
                );
            });
        });
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
                    const planetData = this.#state.planets[bestItem.planetId].data;

                    // save new mine level
                    planetData.buildings[bestItem.mine] = bestItem.level;

                    // apply new lf building levels
                    bestItem.additionalLifeformBuildings.forEach(b => {
                        planetData.lifeformBuildings[b.building] = b.levels.to;
                    });

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

    //#region astrophysics amortization item calculation
    // #getAstrophysicsAmortizationItem(): AstrophysicsAmortizationItem {
    //     const levelAstrophysics = this.#state.research[ResearchType.astrophysics];
    //     const currentMaxPlanetCount = Math.ceil(levelAstrophysics / 2) + 1;
    //     const currentPlanetCount = Object.keys(this.#state.planets).length + this.#settings.player.numberOfUnusedRaidColonySlots;
    //     const nextLevelAstrophysics = levelAstrophysics + levelAstrophysics % 2 + 1;

    //     const newLevels: number[] = [];
    //     let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    //     // we don't need to reserch astrophysics if we have less colonies than we can have
    //     if (currentPlanetCount == currentMaxPlanetCount) {
    //         for (let l = levelAstrophysics + 1; l <= nextLevelAstrophysics; l++) {
    //             newLevels.push(l);

    //             const levelCost = Astrophysics.getCost(l);
    //             cost = addCost(cost, levelCost);
    //         }
    //     }
    // }
    //#endregion


    //#region lifeform technology amortization item calculation
    #getLifeformTechnologyItems(): LifeformTechnologyAmortizationItem[] {
        return this.#planets.flatMap(
            planet => [
                ...planet.lifeformResourceProductionBonusTechnologies,
                ...planet.crawlerProductionBonusTechnologies,
                ...planet.collectorClassBonusTechnologies,
            ].map(tech => this.#getLifeformTechnologyItem(planet.data.id, tech))
        );
    }
    #getLifeformTechnologyItem(planetId: number, technology: ResourceProductionBonusLifeformTechnology | CrawlerProductionBonusAndConsumptionReductionLifeformTechnology | CollectorClassBonusLifeformTechnology): LifeformTechnologyAmortizationItem {
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

        let additionalCrawlerBonus = 0;
        let additionalCollectorClassBonus = 0;
        let additionalProductionBonus: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

        if ('getProductionBonus' in technology) {
            const bonus = subCost(technology.getProductionBonus(newLevel), technology.getProductionBonus(newLevel - 1));
            additionalProductionBonus = addCost(additionalProductionBonus, bonus);
        }
        else if ('getCrawlerProductionBonus' in technology) {
            const bonus = technology.getCrawlerProductionBonus(newLevel) - technology.getCrawlerProductionBonus(newLevel - 1);
            additionalCrawlerBonus = bonus;
        }
        else {
            const bonus = technology.getCollectorClassBonus(newLevel) - technology.getCollectorClassBonus(newLevel - 1);
            additionalCollectorClassBonus = bonus;
        }

        const curProduction = this.#state.productionBreakdowns.getTotal();

        const newProductionBreakdowns = this.#state.productionBreakdowns.clone();
        ResourceTypes.forEach(resource => {
            const planetProductionState = newProductionBreakdowns[resource].planets[planetId];

            planetProductionState.lifeformTechnologyBonusProductionFactor += additionalProductionBonus[resource];
            planetProductionState.collectorClassBonusFactor += additionalCollectorClassBonus;
            planetProductionState.lifeformTechnologyCrawlerProductionBonusFactor += additionalCrawlerBonus;
        });
        const newProduction = newProductionBreakdowns.getTotal();


        const productionDelta = subCost(newProduction, curProduction);
        const productionDeltaMsu = this.#getMsu(productionDelta);

        return {
            type: 'lifeform-technology',
            planetId,
            technology: technology.type,
            level: newLevel,

            additionalLifeformBuildings,

            cost: reducedCost,
            costMsu: reducedCostMsu,
            productionDelta,
            productionDeltaMsu,
            timeInHours: reducedCostMsu / productionDeltaMsu,
        };
    }
    #getLifeformTechnologyItem_costReduction(planetState: AmortizationPlanetState, technology: ResourceProductionBonusLifeformTechnology | CrawlerProductionBonusAndConsumptionReductionLifeformTechnology | CollectorClassBonusLifeformTechnology) {
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
            lifeformBuildingCostReduction: { ...planetState.lifeformBuildingCostReductions },
            plasmaTechnologyCostReduction: planetState.plasmaTechnologyCostReduction,
            lifeformTechnologyBoost: planetState.lifeformTechnologyBoost,
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
            let additionalTechBoost = 0;
            if ('getLifeformTechnologyResearchCostAndTimeReduction' in building) {
                additionalCostReduction = building.getLifeformTechnologyResearchCostAndTimeReduction(newLevel).cost
                    - building.getLifeformTechnologyResearchCostAndTimeReduction(newLevel - 1).cost;
            } else {
                additionalTechBoost = building.getLifeformTechnologyBonus(newLevel) - building.getLifeformTechnologyBonus(newLevel - 1);
            }
            const newTotalReducedCost = costs.reduce<Cost>((total, cur) => {
                if ('building' in cur) {
                    const curReducedCost = multiplyCostInt(cur.cost, 1 - localPlanetState.lifeformBuildingCostReduction[cur.building]);
                    return addCost(total, curReducedCost);
                }

                const technologyCostReduction = localPlanetState.lifeformTechnologyCostReduction + additionalCostReduction;
                const technologyBoost = planetState.lifeformTechnologyBoost + additionalTechBoost;
                const xpTechBoost = planetState.lifeformExperienceBoost;
                const costReduction = technologyCostReduction * (1 + technologyBoost) * (1 + xpTechBoost);

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
                [...planetState.lifeformTechnologyResearchBuildings, ...planetState.lifeformTechnologyBoostBuildings].reduce(
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

                localPlanetState.lifeformTechnologyBoost += additionalTechBonus;
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
    //#endregion


    //#region lifeform building amortization item calculation
    #getLifeformBuildingAmortizationItems(): LifeformBuildingAmortizationItem[] {
        return this.#planets.flatMap(
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
        ResourceTypes.forEach(resource => {
            const productionBreakdown = this.#state.productionBreakdowns[resource];
            const newProductionBreakdown = productionBreakdown.clone();

            const additionalProductionBonusForResource = lfBuilding.getProductionBonus(newLevel)[resource] - lfBuilding.getProductionBonus(newLevel - 1)[resource];
            newProductionBreakdown.planets[planetId].lifeformBuildingBonusProductionFactor += additionalProductionBonusForResource;

            const productionDeltaValue = newProductionBreakdown.getTotal() - productionBreakdown.getTotal();
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
        const lifeformBuildingCostReduction = { ...planetState.lifeformBuildingCostReductions };
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
    //#endregion


    //#region plasma technology research amortization item calculation
    #getPlasmaTechnologyAmortizationItem(): PlasmaTechnologyAmortizationItem {
        const newLevel = this.#state.research[ResearchType.plasmaTechnology] + 1;

        const potentiallyReducedResult = this.#getPlasmaTechnologyAmortizationItem_costReduction();
        const reducedResearchCost = potentiallyReducedResult.totalReducedCost;
        const reducedResearchCostMsu = potentiallyReducedResult.totalReducedCostMsu;

        const curProduction = this.#state.productionBreakdowns.getTotal();

        const newProductionBreakdown = this.#state.productionBreakdowns.clone();
        newProductionBreakdown.setPlasmaTechnologyLevel(newLevel);
        const newProduction = newProductionBreakdown.getTotal();

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
            lifeformTechnologyBoost: number;
        }> = {};
        const totalPlasmaTechnologyCostReduction = () => {
            return Object.values(localPlanetStates).reduce((total, planet) => {
                // apply tech bonuses from buildings and xp
                const planetPlasmaTechCostReduction = planet.plasmaTechnologyCostReduction;
                const planetTechBonus = planet.lifeformTechnologyBoost;
                const xpTechBonus = this.#state.planets[planet.id].lifeformExperienceBoost;

                return total + planetPlasmaTechCostReduction * (1 + planetTechBonus) * (1 + xpTechBonus);
            }, 0);
        };

        planetStates.forEach(planetState => {
            localPlanetStates[planetState.data.id] = {
                id: planetState.data.id,
                lifeformBuildingLevels: { ...planetState.data.lifeformBuildings },
                lifeformTechnologyLevels: { ...planetState.data.lifeformTechnologies },
                lifeformTechnologyCostReduction: planetState.lifeformTechnologyCostReduction,
                lifeformBuildingCostReduction: { ...planetState.lifeformBuildingCostReductions },
                plasmaTechnologyCostReduction: planetState.plasmaTechnologyCostReduction,
                lifeformTechnologyBoost: planetState.lifeformTechnologyBoost,
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
                const planetTechBonus = localPlanetState.lifeformTechnologyBoost;
                const xpTechBonus = this.#state.planets[planetId].lifeformExperienceBoost;

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
                            const planetTechBonus = planet.lifeformTechnologyBoost + (planet.id == planetId ? additionalTechBonus : 0);
                            const xpTechBonus = this.#state.planets[planetId].lifeformExperienceBoost;

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
                            const planetTechBonus = planet.lifeformTechnologyBoost;
                            const xpTechBonus = this.#state.planets[planetId].lifeformExperienceBoost;

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
                ?? [...planetState.lifeformTechnologyResearchBuildings, ...planetState.lifeformTechnologyBoostBuildings].reduce(
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

                    localPlanetState.lifeformTechnologyBoost += additionalTechBonus;
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
    //#endregion


    //#region mine amortization item calculation
    #getMineAmortizationItems(): MineAmortizationItem[] {
        return this.#planets.flatMap(
            planet => $mineBuildingTypes.map(
                mineType => this.#getMineAmortizationItem(planet.data.id, mineType)
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

        const resource = $resourceByMineType[mineType];
        const productionBreakdown = this.#state.productionBreakdowns[resource];
        const newProductionBreakdown = productionBreakdown.clone();
        newProductionBreakdown.planets[planetId].mineProduction = mine.getProduction(newLevel, planetState.productionBuildingDependencies);
        newProductionBreakdown.planets[planetId].crawlers.totalMineLevel += 1;

        const productionDeltaValue = newProductionBreakdown.getTotal() - productionBreakdown.getTotal();
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
        const lifeformBuildingCostReduction = { ...planetState.lifeformBuildingCostReductions };
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
    //#endregion

    #getMsu(cost: Cost): number {
        return cost.metal
            + cost.crystal * this.#settings.player.msuConversionRates.crystal
            + cost.deuterium * this.#settings.player.msuConversionRates.deuterium;
    }

    get #planets() {
        return Object.values(this.#state.planets)
            .filter(planet => !this.#settings.planets[planet.data.id].ignore);
    }
}