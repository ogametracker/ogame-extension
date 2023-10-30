import { createMappedRecord, createRecord } from "@/shared/utils/createRecord";
import { ExpeditionEventSize, ExpeditionEventSizes } from "../../expeditions/ExpeditionEventSize";
import { ExpeditionEventType, ExpeditionEventTypes } from "../../expeditions/ExpeditionEventType";
import { PlayerClass } from "../../ogame/classes/PlayerClass";
import { addCost, Cost, multiplyCost, multiplyCostComponentWise } from "../../ogame/common/Cost";
import { getTechnologyBonusFactor } from "../../ogame/lifeforms/utils";
import { ResourceType, ResourceTypes } from "../../ogame/resources/ResourceType";
import { getExpeditionFindFactor } from "../../expeditions/getExpeditionFindFactor";
import { findBaseAmounts } from "../../expeditions/findBaseAmounts";
import { ExpeditionFindableShipTypes } from "../../expeditions/ExpeditionEvents";
import { ShipByTypes } from "../../ogame/ships/ShipTypes";
import { Reaper } from "../../ogame/ships/Reaper";

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

const largestShip = Reaper;
const largestShipUnits = largestShip.cost.metal + largestShip.cost.crystal;
const scaledCosts = ExpeditionFindableShipTypes.map(shipType => {
    const ship = ShipByTypes[shipType];
    const units = ship.cost.metal + ship.cost.crystal;
    const costScaled = multiplyCost(ship.cost, largestShipUnits / units);
    return costScaled;
});
const scaledCostSum = addCost(...scaledCosts);
const scaledUnitsSum = scaledCostSum.metal + scaledCostSum.crystal;
const fleetResourceFactors = {
    [ResourceType.metal]: scaledCostSum.metal / scaledUnitsSum,
    [ResourceType.crystal]: scaledCostSum.crystal / scaledUnitsSum,
    [ResourceType.deuterium]: scaledCostSum.deuterium / scaledUnitsSum,
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
            ? (1 + this.options.serverSettings.discovererExpeditionBonus) * (1 + this.#lifeformDiscovererClassBonus) * this.options.serverSettings.economySpeed
            : 1;

        const eventBonuses = this.#lifeformExpeditionEventBonuses;


        const averageResourceFindsBySize = createRecord(ExpeditionEventSizes, size => {
            const sum = findBaseAmounts[size].map(baseAmount => {
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

            return multiplyCost(sum, 1 / findBaseAmounts[size].length);
        });
        const totalAvgResourceFind = addCost(
            multiplyCost(averageResourceFindsBySize.small, eventSizeProbabilities.resources.small),
            multiplyCost(averageResourceFindsBySize.medium, eventSizeProbabilities.resources.medium),
            multiplyCost(averageResourceFindsBySize.large, eventSizeProbabilities.resources.large),
        );

        const averageFleetFindsBySize = createRecord(ExpeditionEventSizes, size => {
            const sum = findBaseAmounts[size].map(baseAmount => {
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

            return multiplyCost(sum, 1 / findBaseAmounts[size].length);
        });
        const totalAvgFleetFind = addCost(
            multiplyCost(averageFleetFindsBySize.small, eventSizeProbabilities.fleet.small),
            multiplyCost(averageFleetFindsBySize.medium, eventSizeProbabilities.fleet.medium),
            multiplyCost(averageFleetFindsBySize.large, eventSizeProbabilities.fleet.large),
        );


        return addCost(totalAvgResourceFind, totalAvgFleetFind);
    }

    clone(): AmortizationExpeditionResultsBreakdown {
        const optionsClone = JSON.parse(JSON.stringify(this.options)) as AmortizationExpeditionResultsBreakdownOptions;

        return new AmortizationExpeditionResultsBreakdown(optionsClone);
    }
}