import type { PlanetActiveItems } from '../../empire/PlanetActiveItems';
import { Items, type ItemId } from '../items/Items.generated';
import { isItemActive } from '../resource-production/getItemBonus';

export function getItemSlotBonus(activeItems: PlanetActiveItems): number {
    const now = Date.now();
    const activeTiers = new Set<number>();

    for (const id of Object.keys(activeItems) as ItemId[]) {
        const effect = Items[id]?.effect;
        if (effect?.type === 'expeditionSlots' && isItemActive(now, activeItems[id])) {
            activeTiers.add(effect.value);
        }
    }

    return [...activeTiers].reduce((sum, slots) => sum + slots, 0);
}
