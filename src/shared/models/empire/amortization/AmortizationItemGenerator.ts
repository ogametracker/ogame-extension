import { DefenseCount } from "@/shared/models/empire/DefenseCount";
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
import { AnyBuildingCostAndTimeReductionLifeformBuildings, AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform, LifeformTechnologyBonusLifeformBuildings, LifeformTechnologyBonusLifeformBuildingsByLifeform, LifeformTechnologyResearchBuildings, LifeformTechnologyResearchBuildingsByLifeform, ResourceProductionBonusLifeformBuildingsByLifeform } from "@/shared/models/ogame/lifeforms/buildings/LifeformBuildings";
import { getLifeformLevelTechnologyBonus } from "@/shared/models/ogame/lifeforms/experience";
import { LifeformBuildingType, LifeformBuildingTypes } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { LifeformType, LifeformTypes, ValidLifeformType } from "@/shared/models/ogame/lifeforms/LifeformType";
import { ClassBonusLifeformTechnology, CrawlerProductionBonusAndConsumptionReductionLifeformTechnology, ExpeditionBonusLifeformTechnology, ExpeditionEventProbabilityBonusLifeformTechnology, ResearchCostAndTimeReductionLifeformTechnology, ResourceProductionBonusLifeformTechnology } from "@/shared/models/ogame/lifeforms/technologies/interfaces";
import { ClassBonusLifeformTechnologies, CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies, ExpeditionBonusLifeformTechnologies, ExpeditionEventProbabilityBonusLifeformTechnologies, ResearchCostAndTimeReductionLifeformTechnologies, ResourceProductionBonusLifeformTechnologies } from "@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies";
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
import { createMappedRecord, createRecord } from "@/shared/utils/createRecord";
import { __measure } from "@/shared/utils/performance/__measure";
import { _throw } from "@/shared/utils/_throw";
import { getMsuOrDsu } from "@/views/stats/models/settings/getMsuOrDsu";
import { formatWithOptions } from "date-fns/fp";
import { ExpeditionEventType, ExpeditionEventTypes } from "../../expeditions/ExpeditionEventType";
import { PlayerClass } from "../../ogame/classes/PlayerClass";
import { getItemSlotBonus } from "../../ogame/expeditions/getItemSlotBonus";
import { MissileType } from "../../ogame/missiles/MissileType";
import { AmortizationAstrophysicsSettings } from "./AmortizationAstrophysicsSettings";
import { AmortizationExpeditionResultsBreakdown, AmortizationExpeditionResultsPlanetState } from "./AmortizationExpeditionResultsBreakdown";
import { AmortizationExpeditionSettings } from "./AmortizationExpeditionSettings";
import { AmortizationPlanetSettings } from "./AmortizationPlanetSettings";
import { AmortizationPlayerSettings } from "./AmortizationPlayerSettings";
import { AmortizationItem, AstrophysicsAmortizationItem, LifeformBuildingAmortizationItem, LifeformBuildingLevels, LifeformTechnologyAmortizationItem, LifeformTechnologyLevels, MineAmortizationItem, MineBuildingType, PlasmaTechnologyAmortizationItem } from "./models";


const $mineBuildingTypes: MineBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
const $minesByType: Record<MineBuildingType, ProductionBuilding> = {
    [BuildingType.metalMine]: MetalMine,
    [BuildingType.crystalMine]: CrystalMine,
    [BuildingType.deuteriumSynthesizer]: DeuteriumSynthesizer,
};
const $minesByResource: Record<ResourceType, ProductionBuilding> = {
    metal: MetalMine,
    crystal: CrystalMine,
    deuterium: DeuteriumSynthesizer,
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
    includePlasmaTechnology: boolean;
    expeditions: AmortizationExpeditionSettings;
}
interface EmpireProductionBreakdowns extends Record<ResourceType, EmpireProductionBreakdown> {
    setPlasmaTechnologyLevel(level: number): void;
    getTotal(): Cost;
    clone(): EmpireProductionBreakdowns;
}

export interface AmortizationPlanetState {
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

    collectorClassBonusTechnologies: ClassBonusLifeformTechnology[];
    lifeformResourceProductionBonusTechnologies: ResourceProductionBonusLifeformTechnology[];
    crawlerProductionBonusTechnologies: CrawlerProductionBonusAndConsumptionReductionLifeformTechnology[];

    discovererClassBonusTechnologies: ClassBonusLifeformTechnology[];
    lifeformExpeditionBonusTechnologies: ExpeditionBonusLifeformTechnology[];
}

interface AmortizationItemGeneratorState {
    planets: Record<number, AmortizationPlanetState>;
    productionBreakdowns: EmpireProductionBreakdowns;
    research: Record<ResearchType, number>;

    expeditions: AmortizationExpeditionResultsBreakdown;

    get totalPlasmaTechnologyCostReduction(): number;
}

/* This class generates the next best amortizations items based on the settings provided.
 * Please don't a take a deep look into its code, it is awful.
 */
export class AmortizationItemGenerator {
    readonly #settings: AmortizationGenerationSettings;
    readonly #lifeformExperience: Record<ValidLifeformType, number>;
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
    readonly #getMsuOrDsu: (cost: Cost) => number;

    public constructor(data: {
        settings: AmortizationGenerationSettings;
        lifeformExperience: Record<ValidLifeformType, number>;
        serverSettings: ServerSettings
        getMsuOrDsu: (cost: Cost) => number;
    }) {
        this.#settings = data.settings;
        this.#lifeformExperience = data.lifeformExperience;
        this.#serverSettings = data.serverSettings;
        this.#getMsuOrDsu = getMsuOrDsu;
    }

    public nextItem(): AmortizationItem | null {
        const generator = this.#generator ?? this.#initGenerator();

        const result = __measure('generate next amortization item', () => generator.next());
        if (result.done) {
            return null;
        }

        return result.value;
    }

    #excludeIgnoredResources(cost: Cost): Cost {
        const copy: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

        this.#settings.player.optimizeForResources.forEach(resource => copy[resource] = cost[resource]);

        return copy;
    }

    #initGenerator(): Generator<AmortizationItem, void, unknown> {
        const generator = this.#generateNextItem();

        const planets = Object.values(this.#settings.planets);
        const planetStates: Record<number, AmortizationPlanetState> = {};
        planets.forEach(planet => {
            planetStates[planet.id] = this.#init_getPlanetState(planet);
        });

        const researchLevels = {
            [ResearchType.plasmaTechnology]: this.#settings.player.levelPlasmaTechnology,
            [ResearchType.astrophysics]: this.#settings.player.levelAstrophysics,
        } as Record<ResearchType, number>;

        const lifeformExperienceBonus = createRecord(LifeformTypes, lf => lf == LifeformType.none ? 0 : getLifeformLevelTechnologyBonus(this.#lifeformExperience[lf]));

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
                collectorClassBonusFactor: this.#init_getPlanetCollectorClassBonusFactor(planetState),
                lifeformBuildingBonusProductionFactor: this.#init_getPlanetLifeformBuildingBonusProductionFactor(planetState),
                lifeformTechnologyBonusProductionFactor: this.#init_getPlanetLifeformTechnologyBonusProductionFactor(planetState),
                lifeformTechnologyCrawlerProductionBonusFactor: this.#init_getPlanetLifeformTechnologyCrawlerProductionBonusFactor(planetState),
                lifeformTechnologyBoost: this.#init_getPlanetLifeformTechnologyBoost(planetState),
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
                fusionReactorConsumption: 0,
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
                fusionReactorConsumption: 0,
            };
            empireProductionPlanetStates.deuterium[planetId] = {
                baseProduction: 0,
                mineProduction: DeuteriumSynthesizer.getProduction(levelDeuteriumSynthesizer, planetState.productionBuildingDependencies),
                itemBonusProductionFactor: getItemBonus(ResourceType.deuterium, planetState.data.activeItems),
                ...baseProductionConfig,
                lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.deuterium,
                lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.deuterium,
                fusionReactorConsumption: 0,
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


        const globalActiveItems = createRecord(this.#settings.expeditions.items, _ => 'permanent' as const);
        this.#state.expeditions = new AmortizationExpeditionResultsBreakdown({
            admiral: this.#settings.player.officers.admiral,
            astrophysicsLevel: researchLevels[ResearchType.astrophysics],
            fleetFindsResourceFactors: this.#settings.expeditions.fleetUnitsFactors,
            itemBonusSlots: getItemSlotBonus(globalActiveItems),
            playerClass: this.#settings.player.playerClass,
            serverSettings: {
                discovererExpeditionSlotBonus: this.#serverSettings.playerClasses.discoverer.bonusExpeditionSlots,
                discovererExpeditionBonus: this.#serverSettings.playerClasses.discoverer.expeditions.outcomeFactorBonus,
                economySpeed: this.#serverSettings.speed.economy,
                topScore: this.#serverSettings.topScore ?? 0,
            },
            planets: createMappedRecord(
                planets,
                planet => planet.id,
                planet => this.#init_getPlanetExpeditionState(planetStates[planet.id])
            ),
        });

        return this.#generator = generator;
    }

    #init_getPlanetExpeditionState(planetState: AmortizationPlanetState): AmortizationExpeditionResultsPlanetState {
        const state: AmortizationExpeditionResultsPlanetState = {
            id: planetState.data.id,
            lifeformExperienceBoost: planetState.lifeformExperienceBoost,
            lifeformTechnologyBoost: planetState.lifeformTechnologyBoost,
            discovererClassBonusFactor: this.#init_getPlanetDiscovererClassBonusFactor(planetState),
            lifeformTechnologyExpeditionBonusFactor: this.#init_getLifeformTechnologyExpeditionBonusFactor(planetState),
        };
        return state;
    }

    #init_getPlanetState(planet: AmortizationPlanetSettings): AmortizationPlanetState {
        const planetData = this.#init_getPlanetData(planet);

        const lifeformResourceProductionBonusBuildings = ResourceProductionBonusLifeformBuildingsByLifeform[planet.lifeform];

        // lf building cost reduction
        const lifeformBuildingCostReductionBuildings = AnyBuildingCostAndTimeReductionLifeformBuildingsByLifeform[planet.lifeform]
            .filter(b => LifeformBuildingTypes.some(lfBuildingType => b.appliesTo(lfBuildingType)));

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
            : getLifeformLevelTechnologyBonus(this.#lifeformExperience[planet.lifeform]);

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
    #init_getPlanetCollectorClassBonusFactor(planetState: AmortizationPlanetState) {
        return planetState.collectorClassBonusTechnologies.reduce(
            (total, tech) => total + tech.getClassBonus(PlayerClass.collector, planetState.data.lifeformTechnologies[tech.type] ?? 0),
            0
        );
    }
    #init_getPlanetLifeformTechnologyBoost(planetState: AmortizationPlanetState) {
        return planetState.lifeformTechnologyBoostBuildings.reduce(
            (total, building) => total + building.getLifeformTechnologyBonus(planetState.data.lifeformBuildings[building.type]),
            0
        );
    }
    #init_getPlanetLifeformTechnologyCrawlerProductionBonusFactor(planetState: AmortizationPlanetState) {
        return planetState.crawlerProductionBonusTechnologies.reduce(
            (total, tech) => total + tech.getCrawlerProductionBonus(planetState.data.lifeformTechnologies[tech.type]),
            0
        );
    }
    #init_getPlanetLifeformBuildingBonusProductionFactor(planetState: AmortizationPlanetState): Cost {
        return planetState.lifeformResourceProductionBonusBuildings.reduce<Cost>(
            (total, building) => addCost(total, building.getProductionBonus(planetState.data.lifeformBuildings[building.type])),
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );
    }
    #init_getPlanetLifeformTechnologyBonusProductionFactor(planetState: AmortizationPlanetState): Cost {
        return planetState.lifeformResourceProductionBonusTechnologies.reduce<Cost>(
            (total, tech) => addCost(total, tech.getProductionBonus(planetState.data.lifeformTechnologies[tech.type])),
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );
    }
    #init_getPlanetDiscovererClassBonusFactor(planetState: AmortizationPlanetState) {
        return planetState.discovererClassBonusTechnologies.reduce(
            (total, tech) => total + tech.getClassBonus(PlayerClass.discoverer, planetState.data.lifeformTechnologies[tech.type] ?? 0),
            0
        );
    }
    #init_getLifeformTechnologyExpeditionBonusFactor(planetState: AmortizationPlanetState) {
        return createRecord(
            ExpeditionEventTypes,
            eventType => planetState.lifeformExpeditionBonusTechnologies.reduce(
                (total, tech) => total + tech.getExpeditionBonus(eventType, planetState.data.lifeformTechnologies[tech.type] ?? 0),
                0
            )
        );
    }

    #updateState() {
        const levelPlasmaTechnology = this.#state.research[ResearchType.plasmaTechnology];
        this.#state.productionBreakdowns.setPlasmaTechnologyLevel(levelPlasmaTechnology);

        ResourceTypes.forEach(resource => {
            const productionBreakdown = this.#state.productionBreakdowns[resource];

            const mine = $minesByResource[resource];

            Object.values(this.#state.planets).forEach(planetState => this.#update_planetState(planetState, productionBreakdown, resource, mine));
        });

        Object.values(this.#state.expeditions.options.planets).forEach(planet => {
            this.#update_planetExpeditionState(planet);
        });
    }
    #update_planetExpeditionState(planet: AmortizationExpeditionResultsPlanetState, planetState?: AmortizationPlanetState) {
        planetState ??= this.#state.planets[planet.id];

        planet.discovererClassBonusFactor = this.#init_getPlanetDiscovererClassBonusFactor(planetState);
        planet.lifeformTechnologyExpeditionBonusFactor = this.#init_getLifeformTechnologyExpeditionBonusFactor(planetState);
        planet.lifeformTechnologyBoost = this.#init_getPlanetLifeformTechnologyBoost(planetState);
    }
    #update_planetState(planetState: AmortizationPlanetState, productionBreakdown: EmpireProductionBreakdown, resource: ResourceType, mine: typeof MetalMine | typeof CrystalMine | typeof DeuteriumSynthesizer) {
        const mineType = mine.type as MineBuildingType;
        const planetData = planetState.data;

        // update production
        {
            const empireProductionState = productionBreakdown.planets[planetData.id];

            // update mine production
            empireProductionState.mineProduction = mine.getProduction(planetData.buildings[mineType], planetState.productionBuildingDependencies);

            // update lifeform-related bonuses
            empireProductionState.lifeformBuildingBonusProductionFactor = this.#init_getPlanetLifeformBuildingBonusProductionFactor(planetState)[resource];

            empireProductionState.collectorClassBonusFactor = this.#init_getPlanetCollectorClassBonusFactor(planetState);
            empireProductionState.lifeformTechnologyBonusProductionFactor = this.#init_getPlanetLifeformTechnologyBonusProductionFactor(planetState)[resource];

            empireProductionState.lifeformTechnologyCrawlerProductionBonusFactor = this.#init_getPlanetLifeformTechnologyCrawlerProductionBonusFactor(planetState);
            empireProductionState.crawlers.totalMineLevel = $mineBuildingTypes.reduce((total, mineType) => total + planetData.buildings[mineType], 0);

            empireProductionState.lifeformTechnologyBoost = this.#init_getPlanetLifeformTechnologyBoost(planetState);
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
    }

    * #generateNextItem(): Generator<AmortizationItem, void, unknown> {
        let newPlanets = 0;

        while (true) {
            let items: AmortizationItem[] = [];

            const mineItems = this.#getMineAmortizationItems();
            const lifeformBuildingItems = this.#getLifeformProductionBonusBuildingAmortizationItems();
            const lifeformTechnologyItems = this.#getLifeformTechnologyAmortizationItems();
            items.push(...mineItems, ...lifeformBuildingItems, ...lifeformTechnologyItems);

            if (this.#settings.includePlasmaTechnology) {
                const plasmaTechItem = this.#getPlasmaTechnologyAmortizationItem();
                items.push(plasmaTechItem);
            }
            if (this.#settings.astrophysics.planet.include) {
                const astrophysicsItem = this.#getAstrophysicsAmortizationItem(-newPlanets - 1, this.#state.expeditions);
                items.push(astrophysicsItem);
            }


            items = items
                //remove items with production delta = 0, because plasmatech and others can have no effect if there are no mines at all
                .filter(item => item.productionDeltaConverted > 0)
                .sort((a, b) => {
                    // sort by amortization time, then by cost
                    const compareTime = a.timeInHours - b.timeInHours;
                    if (compareTime != 0) {
                        return compareTime;
                    }

                    return a.costConverted - b.costConverted;
                });

            if (items.length == 0) {
                break;
            }

            const bestItem = items[0];
            switch (bestItem.type) {
                case 'mine': {
                    const planetData = this.#state.planets[bestItem.planetId].data;

                    // save new mine level
                    planetData.buildings[bestItem.mine] = bestItem.level;

                    // apply new lf building levels
                    bestItem.additionalLifeformBuildings.forEach(b => {
                        planetData.lifeformBuildings[b.building] = b.levels.to;
                    });
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
                    break;
                }

                case 'astrophysics-and-colony': {
                    newPlanets++;

                    const newAstroLevel = Math.max(this.#state.research[ResearchType.astrophysics], ...bestItem.levels);
                    this.#state.research[ResearchType.astrophysics] = newAstroLevel;

                    this.#state.planets[bestItem.newPlanetId] = bestItem.planetState;
                    this.#state.expeditions.options.planets[bestItem.newPlanetId] = bestItem.planetExpeditionState;
                    ResourceTypes.forEach(resource => {
                        this.#state.productionBreakdowns[resource].addPlanet(bestItem.newPlanetId, bestItem.newPlanetProductionStates[resource]);
                    });

                    this.#settings.planets[bestItem.newPlanetId] = {
                        ...this.#settings.astrophysics.planet,
                    };
                    break;
                }

                default: _throw('invalid item type');
            }

            this.#updateState();

            yield bestItem;
        }
    }

    //#region astrophysics amortization item calculation
    #getAstrophysicsAmortizationItem(planetId: number, expeditionBreakdown: AmortizationExpeditionResultsBreakdown): AstrophysicsAmortizationItem {
        const currentPlanetCount = Object.keys(this.#state.planets).length + this.#settings.player.numberOfUnusedRaidColonySlots;
        const minAstroLevel = (currentPlanetCount - 1) * 2 - 1;
        const levelAstrophysics = Math.max(minAstroLevel, this.#state.research[ResearchType.astrophysics]);
        const currentMaxPlanetCount = Math.ceil(levelAstrophysics / 2) + 1;
        const nextLevelAstrophysics = levelAstrophysics + levelAstrophysics % 2 + 1;

        const newAstrophysicsLevels: number[] = [];
        let totalCost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
        // we don't need to reserch astrophysics if we have less colonies than we can have
        if (currentPlanetCount == currentMaxPlanetCount) {
            for (let l = levelAstrophysics + 1; l <= nextLevelAstrophysics; l++) {
                newAstrophysicsLevels.push(l);

                const levelCost = Astrophysics.getCost(l);
                totalCost = addCost(totalCost, levelCost);
            }
        }

        let planetState = this.#init_getPlanetState({
            ...this.#settings.astrophysics.planet,
            id: planetId,
        });

        let planetExpeditionState = this.#init_getPlanetExpeditionState(planetState);
        const expeditionsPerHour = expeditionBreakdown.slots * this.#settings.expeditions.wavesPerDay / 24;
        const curExpeditionFindsPerHour = multiplyCost(
            expeditionBreakdown.averageExpeditionFinds,
            expeditionsPerHour,
        );

        const planetSettings = this.#settings.astrophysics.planet;
        const position = planetSettings.position;
        const items = planetSettings.activeItems.reduce<Partial<Record<ItemHash, "permanent">>>((acc, cur) => {
            acc[cur] = 'permanent';
            return acc;
        }, {});

        const lifeformExperienceBonus = createRecord(
            LifeformTypes,
            lf => lf == LifeformType.none ? 0 : getLifeformLevelTechnologyBonus(this.#lifeformExperience[lf])
        );
        const baseProductionConfig: Omit<EmpireProductionPlanetState, 'baseProduction' | 'mineProduction' | 'itemBonusProductionFactor'> = {
            crawlers: {
                available: planetSettings.crawlers.max
                    ? 10_000
                    : planetSettings.crawlers.count,
                percentage: planetSettings.crawlers.percentage,
                totalMineLevel: 0,
            },
            lifeformExperienceBoost: lifeformExperienceBonus[planetSettings.lifeform],
            collectorClassBonusFactor: 0,
            lifeformTechnologyCrawlerProductionBonusFactor: 0,
            lifeformTechnologyBoost: 0,
            lifeformBuildingBonusProductionFactor: 0,
            lifeformTechnologyBonusProductionFactor: 0,
            fusionReactorConsumption: 0,
        };
        const newPlanetProductionStates: Record<ResourceType, EmpireProductionPlanetState> = {
            metal: {
                baseProduction: getMetalBaseProduction({
                    planetPosition: position,
                    serverEconomySpeed: this.#serverSettings.speed.economy,
                }),
                mineProduction: 0,
                itemBonusProductionFactor: getItemBonus(ResourceType.metal, items),
                ...baseProductionConfig,
            },
            crystal: {
                baseProduction: getCrystalBaseProduction({
                    planetPosition: position,
                    serverEconomySpeed: this.#serverSettings.speed.economy,
                    serverPositionBoost: this.#serverSettings.resourceProduction.productionFactorBonus.crystal,
                }),
                mineProduction: 0,
                itemBonusProductionFactor: getItemBonus(ResourceType.crystal, items),
                ...baseProductionConfig,
            },
            deuterium: {
                baseProduction: 0,
                mineProduction: 0,
                itemBonusProductionFactor: getItemBonus(ResourceType.deuterium, items),
                ...baseProductionConfig,
            },
        };

        const currentProduction = this.#state.productionBreakdowns.getTotal();

        const newProductionBreakdowns = this.#state.productionBreakdowns.clone();
        newProductionBreakdowns.metal.addPlanet(planetId, newPlanetProductionStates.metal);
        newProductionBreakdowns.crystal.addPlanet(planetId, newPlanetProductionStates.crystal);
        newProductionBreakdowns.deuterium.addPlanet(planetId, newPlanetProductionStates.deuterium);

        const newExpeditionBreakdown = expeditionBreakdown.clone();
        newExpeditionBreakdown.options.planets[planetId] = {
            id: planetId,
            discovererClassBonusFactor: 0,
            lifeformExperienceBoost: lifeformExperienceBonus[planetSettings.lifeform],
            lifeformTechnologyBoost: 0,
            lifeformTechnologyExpeditionBonusFactor: createRecord(ExpeditionEventTypes, 0),
        };

        let timeInHours = Infinity;
        do {
            const mineItems = $mineBuildingTypes.map(mine => this.#getMineAmortizationItem(newProductionBreakdowns, planetState, mine));
            const lfBuildingItems = ResourceProductionBonusLifeformBuildingsByLifeform[planetState.data.activeLifeform]
                .map(lfBuilding => this.#getLifeformProductionBonusBuildingAmortizationItem(newProductionBreakdowns, planetState, lfBuilding));
            const lfTechnologyProductionItems = [
                ...planetState.lifeformResourceProductionBonusTechnologies,
                ...planetState.crawlerProductionBonusTechnologies,
                ...planetState.collectorClassBonusTechnologies,
            ].map(tech => this.#getLifeformTechnologyAmortizationItem(
                newProductionBreakdowns,
                newExpeditionBreakdown,
                planetState,
                tech));

            const lfTechnologyExpeditionItems = this.#settings.expeditions.include
                ? [
                    ...planetState.discovererClassBonusTechnologies,
                    ...planetState.lifeformExpeditionBonusTechnologies,
                ].map(tech => this.#getLifeformTechnologyAmortizationItem(
                    newProductionBreakdowns,
                    newExpeditionBreakdown,
                    planetState,
                    tech))
                : [];

            const items = [...mineItems, ...lfBuildingItems, ...lfTechnologyProductionItems, ...lfTechnologyExpeditionItems];
            const bestItem = items
                .filter(item => item.productionDeltaConverted > 0)
                .reduce<MineAmortizationItem | LifeformBuildingAmortizationItem | LifeformTechnologyAmortizationItem>(
                    (best, item) => item.timeInHours < best.timeInHours ? item : best,
                    { timeInHours: Infinity } as MineAmortizationItem | LifeformBuildingAmortizationItem | LifeformTechnologyAmortizationItem,
                );

            const newTotalCost = addCost(totalCost, bestItem.cost);
            const newTotalCostConverted = this.#getMsuOrDsu(newTotalCost);

            const planetStateClone = this.#clonePlanetState(planetState);
            switch (bestItem.type) {
                case 'mine': {
                    planetStateClone.data.buildings[bestItem.mine] = bestItem.level;
                    bestItem.additionalLifeformBuildings.forEach(levels => {
                        planetStateClone.data.lifeformBuildings[levels.building] = levels.levels.to;
                    });
                    break;
                }

                case 'lifeform-building': {
                    planetStateClone.data.lifeformBuildings[bestItem.building] = bestItem.level;
                    bestItem.additionalLifeformBuildings.forEach(levels => {
                        planetStateClone.data.lifeformBuildings[levels.building] = levels.levels.to;
                    });
                    break;
                }

                case 'lifeform-technology': {
                    planetStateClone.data.lifeformTechnologies[bestItem.technology] = bestItem.level;
                    bestItem.additionalLifeformBuildings.forEach(levels => {
                        planetStateClone.data.lifeformBuildings[levels.building] = levels.levels.to;
                    });
                    break;
                }

                default: _throw(`Invalid amortization item '${bestItem}'`);
            }
            ResourceTypes.forEach(resource => {
                this.#update_planetState(planetStateClone, newProductionBreakdowns[resource], resource, $minesByResource[resource]);
            });
            this.#update_planetExpeditionState(planetExpeditionState, planetStateClone);

            let newProductionDelta = subCost(newProductionBreakdowns.getTotal(), currentProduction);
            let newProductionDeltaConverted = this.#getMsuOrDsu(newProductionDelta);

            if (this.#settings.expeditions.include) {
                // const newExpeditionBreakdown = expeditionBreakdown.clone(); TODO remove
                const newExpeditionsPerHour = newExpeditionBreakdown.slots * this.#settings.expeditions.wavesPerDay / 24;
                newExpeditionBreakdown.options.planets[planetExpeditionState.id] = planetExpeditionState;
                const newExpeditionFindsPerHour = multiplyCost(
                    newExpeditionBreakdown.averageExpeditionFinds,
                    newExpeditionsPerHour,
                );
                const expeditionDelta = subCost(newExpeditionFindsPerHour, curExpeditionFindsPerHour);
                const expeditionDeltaConverted = this.#getMsuOrDsu(expeditionDelta);

                newProductionDelta = addCost(newProductionDelta, expeditionDelta);
                newProductionDeltaConverted += expeditionDeltaConverted;
            }

            const newTimeInHours = newTotalCostConverted / newProductionDeltaConverted;
            if (newTimeInHours > timeInHours) {
                break;
            }

            timeInHours = newTimeInHours;
            totalCost = newTotalCost;
            planetState = planetStateClone;
        } while (true);

        const totalCostConverted = this.#getMsuOrDsu(totalCost);
        let productionDelta = subCost(newProductionBreakdowns.getTotal(), currentProduction);
        productionDelta = this.#excludeIgnoredResources(productionDelta);
        let productionDeltaConverted = this.#getMsuOrDsu(productionDelta);

        if (this.#settings.expeditions) {
            const newExpeditionBreakdown = expeditionBreakdown.clone();
            const newExpeditionsPerHour = newExpeditionBreakdown.slots * this.#settings.expeditions.wavesPerDay / 24;
            newExpeditionBreakdown.options.planets[planetExpeditionState.id] = planetExpeditionState;
            const newExpeditionFindsPerHour = multiplyCost(
                newExpeditionBreakdown.averageExpeditionFinds,
                newExpeditionsPerHour,
            );

            const expeditionDelta = subCost(newExpeditionFindsPerHour, curExpeditionFindsPerHour);
            const expeditionDeltaConverted = this.#getMsuOrDsu(expeditionDelta);

            productionDelta = addCost(productionDelta, expeditionDelta);
            productionDeltaConverted += expeditionDeltaConverted;
        }


        return {
            type: 'astrophysics-and-colony',
            newPlanetId: planetId,
            levels: newAstrophysicsLevels,
            planetState,
            planetExpeditionState,
            newPlanetProductionStates,

            builtLevels: {
                mines: { ...planetState.data.buildings },
                lifeformBuildings: { ...planetState.data.lifeformBuildings },
                lifeformTechnologies: { ...planetState.data.lifeformTechnologies },
            },

            cost: totalCost,
            costConverted: totalCostConverted,

            productionDelta,
            productionDeltaConverted: productionDeltaConverted,

            timeInHours: totalCostConverted / productionDeltaConverted,
        };
    }
    #clonePlanetState(planetState: AmortizationPlanetState): AmortizationPlanetState {
        return {
            ...planetState,

            lifeformBuildingCostReductions: { ...planetState.lifeformBuildingCostReductions },
            mineCostReductions: { ...planetState.mineCostReductions },
            data: JSON.parse(JSON.stringify(planetState.data)) as PlanetData,
        };
    }
    //#endregion


    //#region lifeform technology amortization item calculation
    #getLifeformTechnologyAmortizationItems(): LifeformTechnologyAmortizationItem[] {
        return this.#includedPlanets.flatMap(
            planet => [
                ...planet.lifeformResourceProductionBonusTechnologies,
                ...planet.crawlerProductionBonusTechnologies,
                ...planet.collectorClassBonusTechnologies,

                ...planet.discovererClassBonusTechnologies,
                ...planet.lifeformExpeditionBonusTechnologies,
            ].map(tech => this.#getLifeformTechnologyAmortizationItem(
                this.#state.productionBreakdowns,
                this.#state.expeditions,
                planet,
                tech,
            ))
        );
    }
    #getLifeformTechnologyAmortizationItem(
        productionBreakdowns: EmpireProductionBreakdowns,
        expeditionBreakdown: AmortizationExpeditionResultsBreakdown,
        planetState: AmortizationPlanetState,
        technology: ResourceProductionBonusLifeformTechnology
            | CrawlerProductionBonusAndConsumptionReductionLifeformTechnology
            | ClassBonusLifeformTechnology
            | ExpeditionBonusLifeformTechnology
            | ExpeditionEventProbabilityBonusLifeformTechnology,
    ): LifeformTechnologyAmortizationItem {
        const planetData = planetState.data;
        const planetId = planetData.id;
        const newLevel = planetData.lifeformTechnologies[technology.type] + 1;

        const result = this.#getLifeformTechnologyItem_costReduction(planetState, technology);
        const reducedCost = result.totalReducedCost;
        const reducedCostConverted = result.totalReducedCostConverted;

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
            const bonus = subCost(
                technology.getProductionBonus(newLevel),
                technology.getProductionBonus(newLevel - 1),
            );
            additionalProductionBonus = addCost(additionalProductionBonus, bonus);
        }
        else if ('getCrawlerProductionBonus' in technology) {
            const bonus = technology.getCrawlerProductionBonus(newLevel)
                - technology.getCrawlerProductionBonus(newLevel - 1);
            additionalCrawlerBonus = bonus;
        }
        else if ('getClassBonus' in technology && technology.appliesTo(PlayerClass.collector)) {
            const bonus = technology.getClassBonus(PlayerClass.collector, newLevel)
                - technology.getClassBonus(PlayerClass.collector, newLevel - 1);

            additionalCollectorClassBonus = bonus;
        }

        let productionDelta: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
        let productionDeltaConverted = 0;

        const curProduction = productionBreakdowns.getTotal();

        const newProductionBreakdowns = productionBreakdowns.clone();
        ResourceTypes.forEach(resource => {
            const planetProductionState = newProductionBreakdowns[resource].planets[planetId];

            planetProductionState.lifeformTechnologyBonusProductionFactor += additionalProductionBonus[resource];
            planetProductionState.collectorClassBonusFactor += additionalCollectorClassBonus;
            planetProductionState.lifeformTechnologyCrawlerProductionBonusFactor += additionalCrawlerBonus;
        });
        const newProduction = newProductionBreakdowns.getTotal();


        productionDelta = subCost(newProduction, curProduction);
        productionDelta = this.#excludeIgnoredResources(productionDelta);
        productionDeltaConverted = this.#getMsuOrDsu(productionDelta);


        if (this.#settings.expeditions.include) {
            let additionalDiscovererClassBonus = 0;
            let additionalExpeditionBonuses: Record<ExpeditionEventType, number> = createRecord(ExpeditionEventTypes, 0);
            let additionalExpeditionEventProbabilityBonuses: Record<ExpeditionEventType, number> = createRecord(ExpeditionEventTypes, 0);

            if ('getExpeditionBonus' in technology) {
                ExpeditionEventTypes.forEach(eventType => {
                    const bonus = technology.getExpeditionBonus(eventType, newLevel)
                        - technology.getExpeditionBonus(eventType, newLevel - 1);
                    additionalExpeditionBonuses[eventType] += bonus;
                });
            }
            else if ('getExpeditionEventProbabilityBonus' in technology) {
                ExpeditionEventTypes.forEach(eventType => {
                    const bonus = technology.getExpeditionEventProbabilityBonus(eventType, newLevel)
                        - technology.getExpeditionEventProbabilityBonus(eventType, newLevel - 1);
                    additionalExpeditionEventProbabilityBonuses[eventType] += bonus;
                });
            }
            else if ('getClassBonus' in technology && technology.appliesTo(PlayerClass.discoverer)) {
                const bonus = technology.getClassBonus(PlayerClass.discoverer, newLevel)
                    - technology.getClassBonus(PlayerClass.discoverer, newLevel - 1);

                additionalDiscovererClassBonus = bonus;
            }

            const expeditionsPerHour = expeditionBreakdown.slots * this.#settings.expeditions.wavesPerDay / 24;
            const curExpeditionFindsPerHour = multiplyCost(
                expeditionBreakdown.averageExpeditionFinds,
                expeditionsPerHour,
            );
            const newExpeditionBreakdown = expeditionBreakdown.clone();

            const newPlanetBreakdown = newExpeditionBreakdown.options.planets[planetId];
            newPlanetBreakdown.discovererClassBonusFactor += additionalDiscovererClassBonus;
            ExpeditionEventTypes.forEach(eventType => {
                newPlanetBreakdown.lifeformTechnologyExpeditionBonusFactor[eventType] += additionalExpeditionBonuses[eventType];
            });
            const newExpeditionsPerHour = newExpeditionBreakdown.slots * this.#settings.expeditions.wavesPerDay / 24;
            const newExpeditionFindsPerHour = multiplyCost(
                newExpeditionBreakdown.averageExpeditionFinds,
                newExpeditionsPerHour,
            );
            const expeditionDelta = subCost(newExpeditionFindsPerHour, curExpeditionFindsPerHour);
            const expeditionDeltaConverted = this.#getMsuOrDsu(expeditionDelta);

            productionDelta = addCost(productionDelta, expeditionDelta);
            productionDeltaConverted += expeditionDeltaConverted;
        }


        return {
            type: 'lifeform-technology',
            planetId,
            technology: technology.type,
            level: newLevel,

            additionalLifeformBuildings,

            cost: reducedCost,
            costConverted: reducedCostConverted,
            productionDelta,
            productionDeltaConverted: productionDeltaConverted,

            timeInHours: reducedCostConverted / productionDeltaConverted,
        };
    }

    //TODO: extract lifeform technology boost buildings to separate amortization item
    #getLifeformTechnologyItem_costReduction(
        planetState: AmortizationPlanetState,
        technology: ResourceProductionBonusLifeformTechnology
            | CrawlerProductionBonusAndConsumptionReductionLifeformTechnology
            | ClassBonusLifeformTechnology
            | ExpeditionBonusLifeformTechnology
            | ExpeditionEventProbabilityBonusLifeformTechnology
    ) {
        interface PotentialLifeformTechnologyCostReductionItemBase {
            planetId: number;
            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostConverted: number;
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
        let totalReducedCostConverted = this.#getMsuOrDsu(totalReducedCost);


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

            const newTotalReducedCostConverted = this.#getMsuOrDsu(newTotalReducedCost);

            if (newTotalReducedCostConverted <= totalReducedCostConverted && (best == null || newTotalReducedCostConverted < best.newTotalReducedCostConverted)) {
                const resultBase: PotentialLifeformTechnologyCostReductionItemBase = {
                    planetId: planetData.id,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostConverted: newTotalReducedCostConverted,
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
            const newLevel = localPlanetState.lifeformBuildingLevels[building.type] + 1;
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

            const newTotalReducedCostConverted = this.#getMsuOrDsu(newTotalReducedCost);

            if (newTotalReducedCostConverted <= totalReducedCostConverted && (best == null || newTotalReducedCostConverted < best.newTotalReducedCostConverted)) {
                return {
                    planetId: planetData.id,
                    building,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostConverted: newTotalReducedCostConverted,
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

                    if ((LifeformBuildingTypes as AnyBuildingType[]).includes(affectedBuildingType)) {
                        localPlanetState.lifeformBuildingCostReduction[affectedBuildingType as LifeformBuildingType] += additionalCostReduction;
                    }
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
            totalReducedCostConverted = bestItem.newTotalReducedCostConverted;

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
            totalReducedCostConverted: totalReducedCostConverted,
            newPlanetState: localPlanetState,
            additionalLifeformBuildings,
        };
    }
    //#endregion


    //#region lifeform building amortization item calculation
    #getLifeformProductionBonusBuildingAmortizationItems(): LifeformBuildingAmortizationItem[] {
        return this.#includedPlanets.flatMap(
            planet => ResourceProductionBonusLifeformBuildingsByLifeform[planet.data.activeLifeform].map(
                lfBuilding => this.#getLifeformProductionBonusBuildingAmortizationItem(this.#state.productionBreakdowns, planet, lfBuilding)
            )
        );
    }
    #getLifeformProductionBonusBuildingAmortizationItem(
        productionBreakdowns: EmpireProductionBreakdowns,
        planetState: AmortizationPlanetState,
        lfBuilding: ResourceProductionBonusLifeformBuilding,
    ): LifeformBuildingAmortizationItem {
        const planetData = planetState.data;
        const planetId = planetData.id;
        const newLevel = planetData.lifeformBuildings[lfBuilding.type] + 1;

        const result = this.#getLifeformBuildingAmortizationItem_costReduction(planetState, lfBuilding);
        const reducedCost = result.totalReducedCost;
        const reducedCostConverted = result.totalReducedCostConverted;

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
            const productionBreakdown = productionBreakdowns[resource];
            const newProductionBreakdown = productionBreakdown.clone();

            const additionalProductionBonusForResource = lfBuilding.getProductionBonus(newLevel)[resource] - lfBuilding.getProductionBonus(newLevel - 1)[resource];
            newProductionBreakdown.planets[planetId].lifeformBuildingBonusProductionFactor += additionalProductionBonusForResource;

            const productionDeltaValue = newProductionBreakdown.getTotal() - productionBreakdown.getTotal();
            productionDelta = addCost(productionDelta, {
                metal: 0, crystal: 0, deuterium: 0, energy: 0,
                [resource]: productionDeltaValue,
            });
        });
        productionDelta = this.#excludeIgnoredResources(productionDelta);
        const productionDeltaConverted = this.#getMsuOrDsu(productionDelta);

        return {
            type: 'lifeform-building',
            planetId,
            building: lfBuilding.type,
            level: newLevel,
            additionalLifeformBuildings,

            cost: reducedCost,
            costConverted: reducedCostConverted,
            productionDelta,
            productionDeltaConverted: productionDeltaConverted,
            timeInHours: reducedCostConverted / productionDeltaConverted,
        };
    }
    #getLifeformBuildingAmortizationItem_costReduction(planetState: AmortizationPlanetState, lfBuilding: ResourceProductionBonusLifeformBuilding) {
        interface PotentialLifeformBuildingCostReductionBuilding {
            building: AnyBuildingCostAndTimeReductionLifeformBuilding;
            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostConverted: number;
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
        let totalReducedCostConverted = this.#getMsuOrDsu(reducedBuildingCost);

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

            const newTotalReducedCostConverted = this.#getMsuOrDsu(newTotalReducedCost);

            if (newTotalReducedCostConverted <= totalReducedCostConverted && (best == null || newTotalReducedCostConverted < best.newTotalReducedCostConverted)) {
                return {
                    building: building,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostConverted: newTotalReducedCostConverted,
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
            totalReducedCostConverted = bestBuilding.newTotalReducedCostConverted;

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
            totalReducedCostConverted: totalReducedCostConverted,
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
        const reducedResearchCostConverted = potentiallyReducedResult.totalReducedCostConverted;

        const curProduction = this.#state.productionBreakdowns.getTotal();

        const newProductionBreakdown = this.#state.productionBreakdowns.clone();
        newProductionBreakdown.setPlasmaTechnologyLevel(newLevel);
        const newProduction = newProductionBreakdown.getTotal();

        let productionDelta = subCost(newProduction, curProduction);
        productionDelta = this.#excludeIgnoredResources(productionDelta);
        const productionDeltaConverted = this.#getMsuOrDsu(productionDelta);

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
            costConverted: reducedResearchCostConverted,
            productionDelta,
            productionDeltaConverted: productionDeltaConverted,
            timeInHours: reducedResearchCostConverted / productionDeltaConverted,
        };
    }
    #getPlasmaTechnologyAmortizationItem_costReduction() {
        interface PotentialPlasmaTechnologyCostReductionItemBase {
            planetId: number;

            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostConverted: number;
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
        let totalReducedCostConverted = this.#getMsuOrDsu(reducedResearchCost);



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

        const planetStates = this.#includedPlanets;
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

            const newTotalReducedCostConverted = this.#getMsuOrDsu(newTotalReducedCost);

            if (newTotalReducedCostConverted <= totalReducedCostConverted && (best == null || newTotalReducedCostConverted < best.newTotalReducedCostConverted)) {
                return {
                    planetId,
                    technology,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostConverted: newTotalReducedCostConverted,
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

            const newTotalReducedCostConverted = this.#getMsuOrDsu(newTotalReducedCost);

            if (newTotalReducedCostConverted <= totalReducedCostConverted && (best == null || newTotalReducedCostConverted < best.newTotalReducedCostConverted)) {
                const resultBase: PotentialPlasmaTechnologyCostReductionItemBase = {
                    planetId,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostConverted: newTotalReducedCostConverted,
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

            const newTotalReducedCostMConverted = this.#getMsuOrDsu(newTotalReducedCost);

            if (newTotalReducedCostMConverted <= totalReducedCostConverted && (best == null || newTotalReducedCostMConverted < best.newTotalReducedCostConverted)) {
                return {
                    planetId,
                    building,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostConverted: newTotalReducedCostMConverted,
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

            if (bestPlanetItem.newTotalReducedCostConverted <= totalReducedCostConverted && (best == null || bestPlanetItem.newTotalReducedCostConverted < best.newTotalReducedCostConverted)) {
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
            totalReducedCostConverted = bestItem.newTotalReducedCostConverted;

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
                const idDiff: number = a.technology - b.technology;
                if (idDiff != 0) {
                    return idDiff;
                }
                return a.level - b.level;
            });

        return {
            totalReducedCost,
            totalReducedCostConverted: totalReducedCostConverted,
            newPlanetStates: localPlanetStates,
            additionalLifeformBuildings,
            additionalLifeformTechnologies,
        };
    }
    //#endregion


    //#region mine amortization item calculation
    #getMineAmortizationItems(): MineAmortizationItem[] {
        return this.#includedPlanets.flatMap(
            planet => $mineBuildingTypes.map(
                mineType => this.#getMineAmortizationItem(this.#state.productionBreakdowns, planet, mineType)
            )
        );
    }
    #getMineAmortizationItem(productionBreakdowns: EmpireProductionBreakdowns, planetState: AmortizationPlanetState, mineType: MineBuildingType): MineAmortizationItem {
        const planetData = planetState.data;
        const planetId = planetData.id;
        const newLevel = planetData.buildings[mineType] + 1;
        const mine = $minesByType[mineType];

        const result = this.#getMineAmortizationItem_costReduction(planetState, mineType);
        const reducedCost = result.totalReducedCost;
        const reducedCostConverted = result.totalReducedCostConverted;
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
        const newProductionBreakdowns = productionBreakdowns.clone();
        newProductionBreakdowns[resource].planets[planetId].mineProduction = mine.getProduction(newLevel, planetState.productionBuildingDependencies);
        ResourceTypes.forEach(res => newProductionBreakdowns[res].planets[planetId].crawlers.totalMineLevel += 1);

        const originalProductionDelta = subCost(newProductionBreakdowns.getTotal(), productionBreakdowns.getTotal());
        const productionDelta = this.#excludeIgnoredResources(originalProductionDelta);
        const productionDeltaConverted = this.#getMsuOrDsu(productionDelta);

        return {
            type: 'mine',
            planetId,
            mine: mineType,
            level: newLevel,
            additionalLifeformBuildings,

            cost: reducedCost,
            costConverted: reducedCostConverted,
            productionDelta,
            productionDeltaConverted: productionDeltaConverted,
            timeInHours: reducedCostConverted / productionDeltaConverted,
        };
    }
    #getMineAmortizationItem_costReduction(planetState: AmortizationPlanetState, mineType: MineBuildingType) {
        interface PotentialMineCostReductionBuilding {
            building: AnyBuildingCostAndTimeReductionLifeformBuilding;
            level: number;
            cost: Cost;
            newTotalReducedCost: Cost;
            newTotalReducedCostConverted: number;
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
        let totalReducedCostConverted = this.#getMsuOrDsu(reducedMineCost);

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

            const newTotalReducedCostConverted = this.#getMsuOrDsu(newTotalReducedCost);

            if (newTotalReducedCostConverted <= totalReducedCostConverted && (best == null || newTotalReducedCostConverted < best.newTotalReducedCostConverted)) {
                return {
                    building,
                    level: newLevel,
                    cost,
                    newTotalReducedCost,
                    newTotalReducedCostConverted,
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
            totalReducedCostConverted = bestBuilding.newTotalReducedCostConverted;

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
            totalReducedCostConverted: totalReducedCostConverted,
            mineCostReduction,
            lifeformBuildingCostReduction,
            additionalLifeformBuildings,
        };
    }
    //#endregion

    get #includedPlanets() {
        return Object.values(this.#state.planets)
            .filter(planet => this.#settings.planets[planet.data.id].include);
    }
}