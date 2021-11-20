
export interface ServerData {
    economySpeed: number;
    fleetSpeed: {
        peaceful: number;
        war: number;
        holding: number;
    };
    galaxies: number;
    isDonutGalaxy: boolean;
    systems: number;
    isDonutSystem: boolean;

    isAllianceCombatSystemEnabled: boolean;
    isRapidfireEnabled: boolean;
    debrisFieldsFactor: {
        fleet: number;
        defense: number;
    };
    defenseRepairFactor: number;
    bonusFields: number;
    darkMatterBonus: number;

    wreckfield: {
        isEnabled: boolean;
        minimumRessLost: number;
        minimumLoss: number;
        repairableBase: number;
    };

    deuteriumConsumptionFactor: number;
    isProbeCargoEnabled: boolean;

    researchSpeed: number;
    cargoHyperspaceFactor: number;

    //TODO: Marketplace?

    //TODO: Character classes
}