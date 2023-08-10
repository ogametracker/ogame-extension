interface ServerSpeedSettings {
    economy: number;
    research: number;
    fleet: {
        peaceful: number;
        war: number;
        holding: number;
    };
}

interface ServerUniverseSettings {
    galaxies: {
        count: number;
        isDonut: boolean;
    };
    systems: {
        count: number;
        isDonut: boolean;
    };
}

interface ServerCombatSettings {
    isAllianceCombatSystemEnabled: boolean;
    isRapidfireEnabled: boolean;
    debrisFieldFactors: {
        ships: number;
        defense: number;
    };
    defenseRepairFactor: number;
    wreckfields: ServerWreckfieldSettings;
}

interface ServerWreckfieldSettings {
    isEnabled: boolean;
    minLostResources: number;
    minLostPercentage: number;
    repairableBasePercentage: number;
}

interface ServerFleetSettings {
    deuteriumConsumptionFactor: number;
    espionageProbeCargo: number;
    hyperspaceCargoPercentageFactor: number;
}

interface ServerPlayerClassSettings {
    areEnabled: boolean;

    collector: {
        productionFactorBonus: number;
        tradingShips: {
            speedFactorBonus: number;
            cargoCapacityFactorBonus: number;  
        };
        bonusFleetSlots: number;
        bonusMarketplaceSlots: number;
        energyProductionFactorBonus: number;

        crawlers: {
            productionFactorBonus: number;
            geologistActiveCrawlerFactorBonus: number;
            isOverloadEnabled: boolean;
        };
    };
    general: {
        combatShipSpeedFactorBonus: number;
        deuteriumConsumptionFactorReduction: number;
        recyclers: {
            speedFactorBonus: number;
            deuteriumConsumptionFactorReduction: number;
            cargoCapacityFactorBonus: number;
        };
        bonusFleetSlots: number;
        bonusMoonFields: number;
        hasMorePreciseFleetSpeed: boolean;
        hasAttackerWreckfield: boolean;
    };
    discoverer: {
        researchSpeedFactor: number;
        planetSizeFactorBonus: number;
        phalanxRangeFactorBonus: number;
        hasBonusPlunderForInactivePlayers: boolean;
        expeditions: {
            outcomeFactorBonus: number;
            maxItemsPerDay: number;
            enemyFactorReduction: number;
        };
        bonusExpeditionSlots: number;
    };

    crawlers: {
        maxProductionFactor: number;
        productionBoostFactorPerUnit: number;
        energyComsumptionPerUnit: number;
    };
    reapers: {
        combatDebrisFieldMiningFactor: number;
    };
}

interface ServerMarketplaceSettings {
    isEnabled: boolean;
    tradeRatios: {
        metal: number;
        crystal: number;
        deuterium: number;
    };
    priceRanges: {
        upper: number;
        lower: number;
    };
    taxes: {
        default: number;
        admiral: number;
        canceledOffers: number;
        unsoldOffers: number;
    };
    offerTimeoutInDays: number;
}

interface ServerResourceProductionSettings {
    productionFactorBonus: {
        crystal: {
            default: number;
            pos1: number;
            pos2: number;
            pos3: number;
        };
    };
}

interface ServerLifeformSettings {
    enabled: boolean;
}

export interface ServerSettings {
    lastUpdate: number;
    version: string;

    topScore?: number;
    speed: ServerSpeedSettings;
    universe: ServerUniverseSettings;
    combats: ServerCombatSettings;
    planetBonusFields: number;
    darkMatterBonus: number;
    fleet: ServerFleetSettings;
    playerClasses: ServerPlayerClassSettings;
    marketplace: ServerMarketplaceSettings;
    resourceProduction: ServerResourceProductionSettings;

    lifeforms: ServerLifeformSettings;
}