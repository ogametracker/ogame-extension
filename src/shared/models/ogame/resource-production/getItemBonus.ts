import type { PlanetActiveItems } from '../../empire/PlanetActiveItems';
import { Items, type ItemId } from '../items/Items.generated';
import type { ResourceType } from '../resources/ResourceType';

export function getItemBonus(resource: ResourceType, activeItems: PlanetActiveItems): number {
    const now = Date.now();
    let bonus = 0;

    for (const id of Object.keys(activeItems) as ItemId[]) {
        const effect = Items[id]?.effect;
        if (effect?.type === 'resourceProductionBonus' && isItemActive(now, activeItems[id])) {
            bonus += effect.value[resource] ?? 0;
        }
    }

    return bonus;
}

export function isItemActive(now: number, itemExpiration?: number | 'permanent'): boolean {
    return itemExpiration === 'permanent' || (itemExpiration != null && itemExpiration > now);
}
