import type { PlanetActiveItems } from '../../empire/PlanetActiveItems';
import { Items, type ItemId } from '../items/Items.generated';
import type { ResourceType } from '../resources/ResourceType';

export function getItemBonus(resource: ResourceType, activeItems: PlanetActiveItems): number {
    const now = Date.now();
    let singleResourceBonus = Infinity;
    let allResourceBonus = Infinity;

    for (const id of Object.keys(activeItems) as ItemId[]) {
        const effect = Items[id]?.effect;
        const bonuses = effect?.type === 'resourceProductionBonus' ? effect.value : undefined;
        const bonus = bonuses?.[resource];
        if (bonuses == null || bonus == null || !isItemActive(now, activeItems[id])) {
            continue;
        }

        // Preserve the existing precedence when a snapshot contains overlapping boosts.
        if (Object.keys(bonuses).length === 1) {
            singleResourceBonus = Math.min(singleResourceBonus, bonus);
        } else {
            allResourceBonus = Math.min(allResourceBonus, bonus);
        }
    }

    if (Number.isFinite(singleResourceBonus)) {
        return singleResourceBonus;
    }
    return Number.isFinite(allResourceBonus) ? allResourceBonus : 0;
}

export function isItemActive(now: number, itemExpiration?: number | 'permanent'): boolean {
    return itemExpiration === 'permanent' || (itemExpiration != null && itemExpiration > now);
}
