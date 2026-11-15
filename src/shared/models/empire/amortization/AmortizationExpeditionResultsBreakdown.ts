import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { ExpeditionEventSize, ExpeditionEventSizes } from '../../expeditions/ExpeditionEventSize';
import { ExpeditionEventType } from '../../expeditions/ExpeditionEventType';
import { PlayerClass } from '../../ogame/classes/PlayerClass';
import { addCost, Cost, multiplyCost } from '../../ogame/common/Cost';
import { ResourceType, ResourceTypes } from '../../ogame/resources/ResourceType';
import {
    getExpeditionFindAmounts,
    getExpeditionFindFactors,
    getExpeditionShipUnits,
} from '../../expeditions/getExpeditionFindAmounts';
import {
    getDiscovererLifeformBonus,
    getExpeditionLifeformBonuses,
    type ExpeditionLifeformState,
} from '../../expeditions/getExpeditionLifeformBonuses';
import { findBaseAmounts } from '../../expeditions/findBaseAmounts';
import { ExpeditionFindableShipTypes } from '../../expeditions/ExpeditionEvents';
import { ShipByTypes } from '../../ogame/ships/ShipTypes';
import { Reaper } from '../../ogame/ships/Reaper';

export interface AmortizationExpeditionResultsPlanetState extends ExpeditionLifeformState {
    id: number;
}

type ApplicableExpeditionEventType = ExpeditionEventType.resources | ExpeditionEventType.fleet;

const eventTypeProbabilities: Record<'normal' | 'improved', Record<ApplicableExpeditionEventType, number>> = {
    normal: {
        [ExpeditionEventType.resources]: 0.35_0,
        [ExpeditionEventType.fleet]: 0.17_0,
    },
    improved: {
        [ExpeditionEventType.resources]: 0.40_5,
        [ExpeditionEventType.fleet]: 0.19_5,
    },
};
const resourceProbabilities: Record<ResourceType, number> = {
    [ResourceType.metal]: 3 / 6,
    [ResourceType.crystal]: 2 / 6,
    [ResourceType.deuterium]: 1 / 6,
};
const eventSizeProbabilities: Record<ApplicableExpeditionEventType, Record<ExpeditionEventSize, number>> = {
    [ExpeditionEventType.resources]: {
        [ExpeditionEventSize.small]: 0.92_3,
        [ExpeditionEventSize.medium]: 0.07,
        [ExpeditionEventSize.large]: 0.00_7,
    },
    [ExpeditionEventType.fleet]: {
        [ExpeditionEventSize.small]: 0.89,
        [ExpeditionEventSize.medium]: 0.1,
        [ExpeditionEventSize.large]: 0.01,
    },
};

const largestShip = Reaper;
const largestShipUnits = getExpeditionShipUnits(largestShip.cost);
const scaledCosts = ExpeditionFindableShipTypes.map(shipType => {
    const ship = ShipByTypes[shipType];
    const units = getExpeditionShipUnits(ship.cost);
    const costScaled = multiplyCost(ship.cost, largestShipUnits / units);
    return costScaled;
});
const scaledCostSum = addCost(...scaledCosts);
const scaledUnitsSum = getExpeditionShipUnits(scaledCostSum);
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

    improvedChancesItemActive: boolean;
    itemResourceBoost: number;

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

    get slots(): number {
        const astroSlots = Math.floor(Math.sqrt(this.options.astrophysicsLevel));
        const classBonusSlots =
            this.options.playerClass == PlayerClass.discoverer
                ? Math.trunc(
                      this.options.serverSettings.discovererExpeditionSlotBonus
                          * (1 + this.#lifeformDiscovererClassBonus),
                  )
                : 0;
        const admiralSlots = this.options.admiral ? 1 : 0;

        return astroSlots + classBonusSlots + admiralSlots + this.options.itemBonusSlots;
    }

    get #lifeformDiscovererClassBonus(): number {
        return getDiscovererLifeformBonus(Object.values(this.options.planets));
    }

    get averageExpeditionFinds(): {
        resources: Cost;
        fleet: Cost;
        total: Cost;
    } {
        const factors = getExpeditionFindFactors({
            ...this.options.serverSettings,
            playerClass: this.options.playerClass,
            lifeformDiscovererBonus: this.#lifeformDiscovererClassBonus,
        });
        const bonuses = {
            ...getExpeditionLifeformBonuses(Object.values(this.options.planets)),
            item: this.options.itemResourceBoost,
        };
        const eventProbabilities = this.options.improvedChancesItemActive
            ? eventTypeProbabilities.improved
            : eventTypeProbabilities.normal;

        const findsBySize = ExpeditionEventSizes.map(size => {
            const finds = findBaseAmounts[size].map(base => getExpeditionFindAmounts(base, factors, bonuses));
            const resourceWeight =
                (eventProbabilities.resources * eventSizeProbabilities.resources[size]) / finds.length;
            const fleetWeight = (eventProbabilities.fleet * eventSizeProbabilities.fleet[size]) / finds.length;

            return {
                resources: addCost(
                    ...finds.map(find => ({
                        energy: 0,
                        ...createRecord(
                            ResourceTypes,
                            resource => find[resource] * resourceProbabilities[resource] * resourceWeight,
                        ),
                    })),
                ),
                fleet: addCost(
                    ...finds.map(find => ({
                        energy: 0,
                        ...createRecord(
                            ResourceTypes,
                            resource =>
                                find.shipUnits
                                * fleetResourceFactors[resource]
                                * this.options.fleetFindsResourceFactors[resource]
                                * fleetWeight,
                        ),
                    })),
                ),
            };
        });
        const resources = addCost(...findsBySize.map(find => find.resources));
        const fleet = addCost(...findsBySize.map(find => find.fleet));

        return { resources, fleet, total: addCost(resources, fleet) };
    }

    clone(): AmortizationExpeditionResultsBreakdown {
        const optionsClone = JSON.parse(JSON.stringify(this.options)) as AmortizationExpeditionResultsBreakdownOptions;

        return new AmortizationExpeditionResultsBreakdown(optionsClone);
    }
}
