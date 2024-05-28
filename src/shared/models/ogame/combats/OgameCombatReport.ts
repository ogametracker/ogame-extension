// export interface OgameCombatRound {
//     statistics: null | {
//         hitsAttacker: string;
//         hitsDefender: string;
//         absorbedDamageAttacker: string;
//         absorbedDamageDefender: string;
//         fullStrengthAttacker: string;
//         fullStrengthDefender: string;
//     };

//     attackerLosses: null | Record<string, Record<string, string | undefined> | undefined>;
//     defenderLosses: null | Record<string, Record<string, string | undefined> | undefined>;
//     attackerLossesInThisRound?: Record<string, Record<string, string | undefined> | undefined>;
//     defenderLossesInThisRound?: Record<string, Record<string, string | undefined> | undefined>;
//     attackerShips: Record<string, Record<string, number | undefined>>;
//     defenderShips: Record<string, Record<string, number | undefined>>;
// }

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

// export interface OgameCombatReport {
//     event_time: string;
//     event_timestamp: number;
//     defenderPlanetId: number;
//     coordinates: {
//         galaxy: number;
//         system: number;
//         position: number;
//         planetType: number;
//     };

//     attacker: {
//         0: OgameFleetInfo;
//         [key: number]: OgameFleetInfo;
//     };
//     defender: {
//         0: OgameFleetInfo;
//         [key: number]: OgameFleetInfo;
//     };

//     attackerJSON: {
//         member: {
//             0: OgameFleetInfo;
//             [key: number]: OgameFleetInfo;
//         }
//     };

//     defenderJSON: {
//         member: {
//             0: OgameFleetInfo;
//             [key: number]: OgameFleetInfo;
//         }
//     };

//     combatRounds: OgameCombatRound[];
//     statistic: {
//         lostUnitsAttacker: number;
//         lostUnitsDefender: number;
//     };
//     result: 'draw' | 'defender' | 'attacker';
//     moon: {
//         genesis: boolean;
//         chance: number;
//         size: number;
//         exists: number;
//     };
//     debris: {
//         metalTotal: number;
//         metalRecycledAfterCombat: number;
//         metal: number;
//         crystalTotal: number;
//         crystalRecycledAfterCombat: number;
//         crystal: number;
//         deuteriumTotal: number;
//         deuteriumRecycledAfterCombat: number;
//         deuterium: number;
//         darkMatter: number;
//     };
//     loot: {
//         metal: number;
//         crystal: number;
//         deuterium: number;
//     };
//     honor: {
//         honorableAttacker: boolean;
//         attackerHonorPoints: number;
//         honorableDefender: boolean;
//         defenderHonorPoints: number;
//         isCombatWithoutHonor: boolean;
//     };
//     tacticalRetreat: {
//         active: number;
//         attacker: boolean;
//         supremacy: number;
//     };
//     lootPercentage: number;
//     deathstarDestroyed: boolean;
//     hashcode: string;
//     combatId: string;
//     isExpedition: boolean;
// }

export interface OgameCombatReport {
    coords: string;
    players: Player[];
    combatRounds: OgameCombatRound[];
    result: OgameCombatResult;
    isExpedition: boolean;
}

export interface OgameCombatResult {
    winner: string;
    loot: {
        metal: number;
        crystal: number;
        deuterium: number;
    };
    debris: {
        metal: number;
        crystal: number;
        deuterium: number;
    };

}

export interface OgameCombatRound {
    statistics: null | {
        side: string;
        strength: number;
        hits: number;
        absorbedDamage: number;
    };
    fleets: FleetState[];
}

export interface Player {
    side: string;
    fleetId: number;
    player: {
        type: string;
        id: number;
        name: string;
    };
}

export interface FleetState {
    side: string;
    fleetId: number;
    technologies: TechnologyState[];
}

export interface TechnologyState {
    technologyId: number;
    destroyed: number;
    destroyedTotal: number;
    remaining: number;
}