import { ExpeditionEventType } from '../../expeditions/ExpeditionEventType';
import { Items, type ItemId } from '../items/Items.generated';

export function getExpeditionItemFindBonus(type: ExpeditionEventType, activeItems: readonly ItemId[]): number {
    if (type !== ExpeditionEventType.resources) {
        return 0;
    }

    let bonus = Infinity;
    for (const id of activeItems) {
        const effect = Items[id]?.effect;
        if (effect?.type === 'expeditionResourceBonus') {
            bonus = Math.min(bonus, effect.value);
        }
    }

    return Number.isFinite(bonus) ? bonus : 0;
}
