import { createMappedRecord, createRecord } from "@/shared/utils/createRecord";
import { ExpeditionEventSize } from "../../expeditions/ExpeditionEventSize";
import { ExpeditionEventType, ExpeditionEventTypes } from "../../expeditions/ExpeditionEventType";
import { PlayerClass } from "../../ogame/classes/PlayerClass";
import { addCost, Cost, multiplyCost, multiplyCostComponentWise } from "../../ogame/common/Cost";
import { getTechnologyBonusFactor } from "../../ogame/lifeforms/utils";
import { ResourceType, ResourceTypes } from "../../ogame/resources/ResourceType";
import { getExpeditionFindFactor } from "../../expeditions/getExpeditionFindFactor";

export interface AmortizationExpeditionResultsPlanetState {
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
    [ResourceType.metal]: 0.51, // on avg. about 51%
    [ResourceType.crystal]: 0.49, // on avg. about 49% 
    [ResourceType.deuterium]: 0.065, // on avg. about 6.5% are deuterium (total > 100% because only metal+crystal are counted towards the units)
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
const averageUnitsPerSize: Record<ExpeditionEventSize, number> = {
    [ExpeditionEventSize.small]: 750_000,
    [ExpeditionEventSize.medium]: 1_900_000,
    [ExpeditionEventSize.large]: 3_775_000,
};

export interface AmortizationExpeditionResultsBreakdownOptions {
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

export class AmortizationExpeditionResultsBreakdown {
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
            ? 1.5 * (1 + this.#lifeformDiscovererClassBonus) * this.options.serverSettings.economySpeed 
            : 1;

        const eventBonuses = this.#lifeformExpeditionEventBonuses;

        const foundResourcesUnscaledSum_small = unitsPerSize.small.reduce((total, baseAmount) => {
            const foundAmount = multiplyCost(
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

            return addCost(total, foundAmount);
        }, 
        { 
            metal: 0,
            crystal: 0,
            deuterium: 0,
            energy: 0,
        }); 
        const foundResourcesUnscaled_small = multiplyCost(foundResourcesUnscaledSum_small, 1 / unitsPerSize.small.length);
        
        const foundResourcesUnscaled = eventSizeProbabilities.resources.small * averageUnitsPerSize.small
            // + eventSizeProbabilities.resources.medium * averageUnitsPerSize.medium
            // + eventSizeProbabilities.resources.large * averageUnitsPerSize.large
            ;

        const foundResources = multiplyCost(
            {
                energy: 0,
                ...createRecord(
                    ResourceTypes,
                    resource => foundResourcesUnscaled
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
        debugger;

        const foundFleetResources = multiplyCost(
            multiplyCostComponentWise(
                {
                    energy: 0,
                    ...createRecord(
                        ResourceTypes,
                        resource => foundResourcesUnscaled
                            * resourceFactors.crystal // found fleet units are the same as crystal finds
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


        return addCost(foundResources, foundFleetResources);
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