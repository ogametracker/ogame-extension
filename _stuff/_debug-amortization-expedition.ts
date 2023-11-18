function createRecord<TKey extends string | number | symbol, TValue>(
    keys: TKey[],
    defaultValue: TValue | ((key: TKey) => TValue)
): Record<TKey, TValue> {
    const result = {} as Record<TKey, TValue>;
    keys.forEach(key =>
        result[key] = defaultValue instanceof Function
            ? defaultValue(key)
            : defaultValue
    );

    return result;
}

function createMappedRecord<T, TKey extends string | number | symbol, TValue>(
    input: T[],
    mapKeys: (value: T) => TKey,
    defaultValue: TValue | ((value: T) => TValue)
): Record<TKey, TValue> {
    const result = {} as Record<TKey, TValue>;
    input.forEach(i => {
        const key = mapKeys(i);

        result[key] = defaultValue instanceof Function
            ? defaultValue(i)
            : defaultValue
    });

    return result;
}
enum ExpeditionEventSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
}
const ExpeditionEventSizes = [ExpeditionEventSize.small, ExpeditionEventSize.medium, ExpeditionEventSize.large];
enum ExpeditionEventType {
    nothing = 'nothing',
    resources = 'resources',
    fleet = 'fleet',
    delay = 'delay',
    early = 'early',
    darkMatter = 'darkMatter',
    pirates = 'pirates',
    aliens = 'aliens',
    item = 'item',
    trader = 'trader',
    lostFleet = 'lostFleet',
}
const ExpeditionEventTypes = [
    ExpeditionEventType.nothing,
    ExpeditionEventType.resources,
    ExpeditionEventType.fleet,
    ExpeditionEventType.delay,
    ExpeditionEventType.early,
    ExpeditionEventType.darkMatter,
    ExpeditionEventType.pirates,
    ExpeditionEventType.aliens,
    ExpeditionEventType.item,
    ExpeditionEventType.trader,
    ExpeditionEventType.lostFleet,
];
enum PlayerClass {
    collector = 'collector',
    discoverer = 'discoverer',
    general = 'general',
    none = 'none',
}
interface Cost {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
}

function addCost(...costs: Cost[]): Cost {
    const result: Cost = {
        metal: 0,
        crystal: 0,
        deuterium: 0,
        energy: 0,
    };
    costs.forEach(cost => {
        result.metal += cost.metal;
        result.crystal += cost.crystal;
        result.deuterium += cost.deuterium;
        result.energy += cost.energy;
    });

    return result;
}

function subCost(a: Cost, b: Cost): Cost {
    return {
        metal: a.metal - b.metal,
        crystal: a.crystal - b.crystal,
        deuterium: a.deuterium - b.deuterium,
        energy: a.energy - b.energy,
    };
}

function multiplyCost(cost: Cost, factor: number): Cost {
    return {
        metal: cost.metal * factor,
        crystal: cost.crystal * factor,
        deuterium: cost.deuterium * factor,
        energy: cost.energy * factor,
    };
}
function multiplyCostInt(cost: Cost, factor: number): Cost {
    const newCost = multiplyCost(cost, factor);
    return {
        metal: Math.round(newCost.metal),
        crystal: Math.round(newCost.crystal),
        deuterium: Math.round(newCost.deuterium),
        energy: Math.round(newCost.energy),
    };
}

function multiplyCostComponentWise(cost: Cost, factors: Cost): Cost {
    return {
        metal: cost.metal * factors.metal,
        crystal: cost.crystal * factors.crystal,
        deuterium: cost.deuterium * factors.deuterium,
        energy: cost.energy * factors.energy,
    };
}
function getTechnologyBonusFactor(buildingBoost: number, levelBoost: number): number {
    return (1 + buildingBoost + levelBoost); // this is the correct formula (checked 2023-02-11)
}
enum ResourceType {
    metal = 'metal',
    crystal = 'crystal',
    deuterium = 'deuterium',
}

const ResourceTypes = [
    ResourceType.metal,
    ResourceType.crystal,
    ResourceType.deuterium,
];
function getExpeditionFindFactor(topScore: number): number {
    if (topScore < 100_000) return 0.10;
    if (topScore < 1_000_000) return 0.24;
    if (topScore < 5_000_000) return 0.36;
    if (topScore < 25_000_000) return 0.48;
    if (topScore < 50_000_000) return 0.60;
    if (topScore < 75_000_000) return 0.72;
    if (topScore < 100_000_000) return 0.84;

    return 1.00;
}

interface AmortizationExpeditionResultsPlanetState {
    id: number;

    lifeformTechnologyExpeditionBonusFactor: Record<ExpeditionEventType, number>;
    discovererClassBonusFactor: number;

    lifeformTechnologyBoost: number;
    lifeformExperienceBoost: number;
}

type ApplicableExpeditionEventType = ExpeditionEventType.resources | ExpeditionEventType.fleet;

const eventTypeProbabilities: Record<ApplicableExpeditionEventType, number> = {
    [ExpeditionEventType.resources]: 0.35,
    [ExpeditionEventType.fleet]: 0.17,
};
const resourceProbabilities: Record<ResourceType, number> = {
    [ResourceType.metal]: 3 / 6,
    [ResourceType.crystal]: 2 / 6,
    [ResourceType.deuterium]: 1 / 6,
};
const resourceFactors: Record<ResourceType, number> = {
    [ResourceType.metal]: 1,
    [ResourceType.crystal]: 1 / 2,
    [ResourceType.deuterium]: 1 / 3,
};
const eventSizeProbabilities: Record<ApplicableExpeditionEventType, Record<ExpeditionEventSize, number>> = {
    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: 0.89,
        [ExpeditionEventSize.medium]: 0.10,
        [ExpeditionEventSize.large]: 0.01,
    },
    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: 0.89,
        [ExpeditionEventSize.medium]: 0.10,
        [ExpeditionEventSize.large]: 0.01,
    },
};
const fleetResourceFactors: Record<ResourceType, number> = {
    metal: 0.5363668604610634,
    crystal: 0.46363313953893664,
    deuterium: 0.09295055454475745,
};
const unitsPerSize: Record<ExpeditionEventSize, number[]> = {
    [ExpeditionEventSize.small]: [
        250_000,
        300_000,
        350_000,
        400_000,
        450_000,
        500_000,
        550_000,
        600_000,
        650_000,
        700_000,
        750_000,
        800_000,
        850_000,
        900_000,
        950_000,
        1_000_000,
        1_050_000,
        1_100_000,
        1_150_000,
        1_200_000,
        1_250_000,
    ],
    [ExpeditionEventSize.medium]: [
        1_250_000,
        1_300_000,
        1_350_000,
        1_400_000,
        1_450_000,
        1_500_000,
        1_550_000,
        1_600_000,
        1_650_000,
        1_700_000,
        1_750_000,
        1_800_000,
        1_850_000,
        1_900_000,
        1_950_000,
        2_000_000,
        2_050_000,
        2_100_000,
        2_150_000,
        2_200_000,
        2_250_000,
        2_300_000,
        2_350_000,
        2_400_000,
        2_450_000,
        2_500_000,
    ],
    [ExpeditionEventSize.large]: [
        2_500_000,
        2_550_000,
        2_600_000,
        2_650_000,
        2_700_000,
        2_750_000,
        2_800_000,
        2_850_000,
        2_900_000,
        2_950_000,
        3_000_000,
        3_050_000,
        3_100_000,
        3_150_000,
        3_200_000,
        3_250_000,
        3_300_000,
        3_350_000,
        3_400_000,
        3_450_000,
        3_500_000,
        3_550_000,
        3_600_000,
        3_650_000,
        3_700_000,
        3_750_000,
        3_800_000,
        3_850_000,
        3_900_000,
        3_950_000,
        4_000_000,
        4_050_000,
        4_100_000,
        4_150_000,
        4_200_000,
        4_250_000,
        4_300_000,
        4_350_000,
        4_400_000,
        4_450_000,
        4_500_000,
        4_550_000,
        4_600_000,
        4_650_000,
        4_700_000,
        4_750_000,
        4_800_000,
        4_850_000,
        4_900_000,
        4_950_000,
        5_000_000,
    ],
};

interface AmortizationExpeditionResultsBreakdownOptions {
    playerClass: PlayerClass;
    admiral: boolean;

    astrophysicsLevel: number;
    itemBonusSlots: number;

    fleetFindsResourceFactors: Record<ResourceType, number>;
    serverSettings: {
        topScore: number;
        economySpeed: number;
        discovererExpeditionBonus: number;
        discovererExpeditionSlotBonus: number;
    };
    planets: Record<number, AmortizationExpeditionResultsPlanetState>;
}

class AmortizationExpeditionResultsBreakdown {
    options: AmortizationExpeditionResultsBreakdownOptions;

    public constructor(options: AmortizationExpeditionResultsBreakdownOptions) {
        this.options = options;
    }

    get #resourceFindFactor(): number {
        const score = this.options.serverSettings.topScore;
        return getExpeditionFindFactor(score);
    }

    get slots(): number {
        const astroSlots = Math.floor(Math.sqrt(this.options.astrophysicsLevel));
        const classBonusSlots = this.options.playerClass == PlayerClass.discoverer
            ? Math.trunc(
                this.options.serverSettings.discovererExpeditionSlotBonus
                * (1 + this.#lifeformDiscovererClassBonus)
            )
            : 0;
        const admiralSlots = this.options.admiral ? 1 : 0;

        return astroSlots + classBonusSlots + admiralSlots + this.options.itemBonusSlots;
    }

    get #lifeformDiscovererClassBonus(): number {
        let discovererClassBonus = 0;

        Object.values(this.options.planets).forEach(planet => {
            const techBonusFactor = getTechnologyBonusFactor(planet.lifeformTechnologyBoost, planet.lifeformExperienceBoost);
            discovererClassBonus += planet.discovererClassBonusFactor * techBonusFactor;
        });

        return discovererClassBonus;
    }

    get #lifeformExpeditionEventBonuses(): Record<ExpeditionEventType, number> {
        const result: Record<ExpeditionEventType, number> = {
            ...createRecord(ExpeditionEventTypes, 0),
            [ExpeditionEventType.resources]: 0,
            [ExpeditionEventType.fleet]: 0,
        };

        Object.values(this.options.planets).forEach(planet => {
            const techBonusFactor = getTechnologyBonusFactor(planet.lifeformTechnologyBoost, planet.lifeformExperienceBoost);

            ExpeditionEventTypes.forEach(type => {
                result[type] += planet.lifeformTechnologyExpeditionBonusFactor[type] * techBonusFactor;
            });
        });

        return result;
    }

    get averageExpeditionFinds(): Cost {
        const scoreFactor = this.#resourceFindFactor;

        const pathfinderFactor = 2;

        const classFactor = this.options.playerClass == PlayerClass.discoverer
            ? (1 + this.options.serverSettings.discovererExpeditionBonus) * (1 + this.#lifeformDiscovererClassBonus) * this.options.serverSettings.economySpeed
            : 1;

        const eventBonuses = this.#lifeformExpeditionEventBonuses;


        const averageResourceFindsBySize = createRecord(ExpeditionEventSizes, size => {
            const sum = unitsPerSize[size].map(baseAmount => {
                return multiplyCost(
                    {
                        energy: 0,
                        ...createRecord(
                            ResourceTypes,
                            resource => baseAmount
                                * resourceProbabilities[resource]
                                * resourceFactors[resource]
                        ),
                    },
                    scoreFactor
                    * classFactor
                    * pathfinderFactor
                    * eventTypeProbabilities.resources
                    * (1 + eventBonuses.resources)
                );
            }).reduce((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            return multiplyCost(sum, 1 / unitsPerSize[size].length);
        });
        const totalAvgResourceFind = addCost(
            multiplyCost(averageResourceFindsBySize.small, eventSizeProbabilities.resources.small),
            multiplyCost(averageResourceFindsBySize.medium, eventSizeProbabilities.resources.medium),
            multiplyCost(averageResourceFindsBySize.large, eventSizeProbabilities.resources.large),
        );

        const averageFleetFindsBySize = createRecord(ExpeditionEventSizes, size => {
            const sum = unitsPerSize[size].map(baseAmount => {
                return multiplyCost(
                    multiplyCostComponentWise(
                        {
                            energy: 0,
                            ...createRecord(
                                ResourceTypes,
                                resource => baseAmount
                                * resourceFactors.crystal // baseline for found fleet units is the same as crystal finds
                                * fleetResourceFactors[resource]
                            ),
                        },
                        { energy: 0, ...this.options.fleetFindsResourceFactors },
                    ),
                    scoreFactor
                    * classFactor
                    * pathfinderFactor
                    * eventTypeProbabilities.fleet
                    * (1 + eventBonuses.fleet)
                );
            }).reduce((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            return multiplyCost(sum, 1 / unitsPerSize[size].length);
        });
        const totalAvgFleetFind = addCost(
            multiplyCost(averageFleetFindsBySize.small, eventSizeProbabilities.fleet.small),
            multiplyCost(averageFleetFindsBySize.medium, eventSizeProbabilities.fleet.medium),
            multiplyCost(averageFleetFindsBySize.large, eventSizeProbabilities.fleet.large),
        );


        return addCost(totalAvgResourceFind, totalAvgFleetFind);
    }

    clone(): AmortizationExpeditionResultsBreakdown {
        const planets: Record<number, AmortizationExpeditionResultsPlanetState> = createMappedRecord(
            Object.values(this.options.planets),
            planet => planet.id,
            planet => ({ ...planet }),
        );

        return new AmortizationExpeditionResultsBreakdown({
            ...this.options,
            planets,
        });
    }
}





const breakdown = new AmortizationExpeditionResultsBreakdown({
    admiral: true,
    astrophysicsLevel: 29,
    fleetFindsResourceFactors: {
        metal: 1,
        crystal: 1,
        deuterium: 1,
    },
    itemBonusSlots: 6,
    playerClass: PlayerClass.discoverer,
    serverSettings: {
        topScore: 1_000_000_000,
        discovererExpeditionBonus: 0.5,
        discovererExpeditionSlotBonus: 2,
        economySpeed: 10,
    },
    planets: createRecord([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], id => ({
        id,
        discovererClassBonusFactor: 0.00_2 * (id < 15 ? 13 : 12),
        lifeformExperienceBoost: 0.00_1 * 65,
        lifeformTechnologyBoost: id == 1 ? 0.00_3 * (14+12) : 0.00_5 * 12,
        lifeformTechnologyExpeditionBonusFactor: createRecord(ExpeditionEventTypes, type => {
            switch (type) {
                case ExpeditionEventType.resources: return 0.00_2 * (18 + 16);
                case ExpeditionEventType.fleet: return 0.00_2 * 15;
                default: return 0;
            }
        }),
    })),
});
const oldAvgFinds = breakdown.averageExpeditionFinds;
debugger;
let newBreakdown = breakdown.clone();
let newAvgFinds = oldAvgFinds;
const test = Array.from({ length: 15 }).map((_, i) => {
    newBreakdown = newBreakdown.clone();
    newBreakdown.options.planets[i + 1].discovererClassBonusFactor = 0.00_2 * 1;
    const newAvgFinds2 = newBreakdown.averageExpeditionFinds;

    const diff = subCost(newAvgFinds2, newAvgFinds);
    newAvgFinds = newAvgFinds2;
    return diff;
});
debugger;