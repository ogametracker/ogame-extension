export interface OgameCombatRound {

}

export default interface OgameBattleReport {
    event_time: string;
    event_timestamp: number;
    defenderPlanetId: number;
    coordinates: {
        galaxy: number;   
        system: number;   
        position: number;   
        planetType: number;   
    };

    attacker: ???;
    defender: ???;

    combatRounds: OgameCombatRound[];
    statistic: {
        lostUnitsAttacker: number;
        lostUnitsDefender: number;
    };
    result: 'draw' | 'defender' | 'attacker';
    moon: {
        genesis: boolean;
        chance: number;
        size: number;
        exists: number;
    };
    debris: {
        metalTotal: number;
        metalRecycledAfterCombat: number;
        metal: number;
        crystalTotal: number;
        crystalRecycledAfterCombat: number;
        crystal: number;
        darkMatter: number;
    };
    loot: {
        metal: number;
        crystal: number;
        deuterium: number;
    };
    repairedDefense: ???[];
    honor: {
        honorableAttacker: boolean;
        attackerHonorPoints: number;
        honorableDefender: boolean;
        defenderHonorPoints: number;
        isCombatWithoutHonor: boolean;
    };
    tacticalRetreat: {
        active: number;
        attacker: boolean;
        supremacy: number;
    };
    lootPercentage: number;
    deathstarDestroyed: boolean;
    hashcode: string;
    combatId: string;
    isExpedition: boolean;

    //TODO: we don't really need these
    mission?: number;
    attackerJSON: any;
    defenderJSON: any;
    debugData: any;
    lightFighterCombat: {
        attackerLosses: any;
        defenderLosses: any;
    };
}