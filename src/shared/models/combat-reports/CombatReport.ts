import { Coordinates } from '../ogame/common/Coordinates';
import { ResourceType } from '../ogame/resources/ResourceType';
import { ShipType } from '../ogame/ships/ShipType';
import { CombatResultType } from './CombatResultType';

export interface CombatReport {
    date: number;
    id: number;

    coordinates: Coordinates;
    result: CombatResultType;
    lostShips: Record<ShipType, number>;

    debrisField: {
        [ResourceType.metal]: number;
        [ResourceType.crystal]: number;
        [ResourceType.deuterium]?: number;
    };

    loot: {
        [ResourceType.metal]: number;
        [ResourceType.crystal]: number;
        [ResourceType.deuterium]: number;
    };

    isExpedition: boolean;
    expeditionAttackType: 'pirates' | 'aliens' | null;
}