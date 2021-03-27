import Coordinates from "../Coordinates";
import Fleet from "../Fleet";
import Resource from "../Resource";
import BattleResult from "./BattleResult";

export default interface BattleReport {
    date: number;
    id: number;

    coordinates: Coordinates;

    result: BattleResult;

    attackerLosses: Fleet;
    defenderLosses: Fleet;

    debrisField: {
        [Resource.metal]: number;
        [Resource.crystal]: number;
    };

    loot: {
        [Resource.metal]: number;
        [Resource.crystal]: number;
        [Resource.deuterium]: number;
    };

    honorPoints: number;

    isExpedition: boolean;
    expeditionAttackType: 'pirates' | 'aliens' | null;
}