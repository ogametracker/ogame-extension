import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlanetActiveItemsMessage } from "../../shared/messages/tracking/empire";
import { PlanetActiveItems } from "../../shared/models/empire/PlanetActiveItems";
import { ItemHash } from "../../shared/models/ogame/items/ItemHash";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _throw } from "../../shared/utils/_throw";

export function trackOverviewPage(): void {
    const activeItems: PlanetActiveItems = {};

    const observer = new MutationObserver(() => {
        if (['ogame-timestamp', 'ogame-planet-id'].some(name => document.querySelector(`meta[name="${name}"]`) == null)) {
            return;
        }

        const ogameNowText = (document.querySelector('meta[name="ogame-timestamp"]') as HTMLMetaElement | null)?.content
            ?? _throw('no meta element found for ogame-timestamp');
        const ogameNow = parseIntSafe(ogameNowText, 10) * 1000;

        const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
            ?? _throw('no meta element found for ogame-planet-id');
        const planetId = parseIntSafe(planetIdText, 10);

        const items = document.querySelectorAll('.active_items [data-uuid]:not([ogt-active-until])');

        items.forEach(item => {
            try {
                const hash = item.getAttribute('data-uuid') ?? _throw('no item uuid found');
                const durationLeftElem = item.querySelector('.js_duration') ?? _throw('no item duration found');
                const durationLeftText = durationLeftElem.textContent ?? _throw('no duration found');
                const totalDuration = parseIntSafe(durationLeftElem.getAttribute('data-total-duration') ?? _throw('no duration found'), 10);

                let activeUntil: number | 'permanent' = 'permanent';
                if (durationLeftText != '' && totalDuration > 0) {
                    const durationLeft = parseIntSafe(durationLeftText, 10) * 1000;
                    activeUntil = ogameNow + durationLeft;
                }
                item.setAttribute('ogt-active-until', activeUntil.toString());
                activeItems[hash as ItemHash] = activeUntil;
            } catch (error) {
                console.error(error);
            }
        });

        if (items.length > 0) {
            const message: UpdatePlanetActiveItemsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetActiveItems,
                data: {
                    planetId,
                    data: activeItems,
                },
            };
            chrome.runtime.sendMessage(message);
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
}