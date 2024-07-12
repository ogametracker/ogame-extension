import { Coordinates } from "../common/Coordinates";
import { ShipType } from "../ships/ShipType";

export type OgameCombatReport = {
    coordinates: Coordinates;
    isEspionageCombat: boolean;
    isExpedition: boolean;
    isOwner: boolean;
    isAttacker: boolean;
    isDefender: boolean;
    winner: 'attacker' | 'defender' | 'none';
    loot: Record<'metal' | 'crystal' | 'deuterium', number>;
    debris: Record<'metal' | 'crystal' | 'deuterium', number>;
    playerLosses: Record<ShipType, number>;
}