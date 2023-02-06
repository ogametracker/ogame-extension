import { createMappedRecord, createRecord } from "@/shared/utils/createRecord";
import { ExpeditionEventSize } from "../../expeditions/ExpeditionEventSize";
import { ExpeditionEventType, ExpeditionEventTypes } from "../../expeditions/ExpeditionEventType";
import { PlayerClass } from "../../ogame/classes/PlayerClass";
import { addCost, Cost, multiplyCost, multiplyCostComponentWise } from "../../ogame/common/Cost";
import { getTechnologyBonusFactor } from "../../ogame/lifeforms/utils";
import { ResourceType, ResourceTypes } from "../../ogame/resources/ResourceType";

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
        [ExpeditionEventSize.small]: 0.92_1,
        [ExpeditionEventSize.medium]: 0.07_1,
        [ExpeditionEventSize.large]: 0.00_8,
    },
};
const fleetResourceFactors: Record<ResourceType, number> = {
    [ResourceType.metal]: 0.51, // on avg. about 51%
    [ResourceType.crystal]: 0.49, // on avg. about 49% 
    [ResourceType.deuterium]: 0.065, // on avg. about 6.5% are deuterium (total > 100% because only metal+crystal are counted towards the units)
};
const averageUnitsPerSize: Record<ExpeditionEventSize, number> = {
    [ExpeditionEventSize.small]: 750_000,
    [ExpeditionEventSize.medium]: 1_875_000,
    [ExpeditionEventSize.large]: 3_750_000,
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

        if (score < 100_000) return 0.10;
        if (score < 1_000_000) return 0.24;
        if (score < 5_000_000) return 0.36;
        if (score < 25_000_000) return 0.48;
        if (score < 50_000_000) return 0.60;
        if (score < 75_000_000) return 0.72;
        if (score < 100_000_000) return 0.84;

        return 1.00;
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

        const classFactor = this.options.playerClass == PlayerClass.discoverer
            ? 1.5 * (1 + this.#lifeformDiscovererClassBonus) * this.options.serverSettings.economySpeed //TODO: fix after ingame formula has been fixed
            : 1;

        const eventBonuses = this.#lifeformExpeditionEventBonuses;

        const foundResourcesUnscaled = eventSizeProbabilities.resources.small * averageUnitsPerSize.small
            + eventSizeProbabilities.resources.medium * averageUnitsPerSize.medium
            + eventSizeProbabilities.resources.large * averageUnitsPerSize.large;

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
            * eventTypeProbabilities.resources
            * (1 + eventBonuses.resources)
        );

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