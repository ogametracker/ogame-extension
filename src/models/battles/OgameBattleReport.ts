import Ship from "../Ship";

export interface OgameCombatRound {
    statistics: null | {
        hitsAttacker: string;
        hitsDefender: string;
        absorbedDamageAttacker: string;
        absorbedDamageDefender: string;
        fullStrengthAttacker: string;
        fullStrengthDefender: string;
    };

    attackerLosses: Record<string, Record<string, string | undefined> | undefined>;
    defenderLosses: Record<string, Record<string, string | undefined> | undefined>;
    attackerLossesInThisRound: Record<string, Record<string, string | undefined> | undefined>;
    defenderLossesInThisRound: Record<string, Record<string, string | undefined> | undefined>;
    attackerShips: Record<string, Record<string, number | undefined>>;
    defenderShips: Record<string, Record<string, number | undefined>>;
}

export interface OgameShipDetails {
    armor: number;
    weapon: number;
    shield: number;
    count: number;
}

export interface OgameFleetInfo {
    ownerName: string;
    ownerCharacterClassId: number;
    ownerCharacterClassName: string;
    ownerID: number;
    ownerCoordinates: string;
    ownerPlanetType: number;
    ownerHomePlanet: string;
    planetId: number;
    fleetID: number;
    ownerAlliance: string;
    ownerAllianceTag: string;

    armorPercentage: number;
    weaponPercentage: number;
    shieldPercentage: number;

    shipDetails: Record<string, undefined | OgameShipDetails>;
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

    attacker: {
        0: OgameFleetInfo;
        [key: number]: OgameFleetInfo;
    };
    defender: {
        0: OgameFleetInfo;
        [key: number]: OgameFleetInfo;
    };

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

    //we don't really need these
    // repairedDefense: unknown[];
    // mission?: number;
    // attackerJSON: any;
    // defenderJSON: any;
    // debugData: any;
    // lightFighterCombat: {
    //     attackerLosses: any;
    //     defenderLosses: any;
    // };
}