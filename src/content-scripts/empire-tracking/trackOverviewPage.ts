import { MessageType } from "../../shared/messages/MessageType";
import { UpdatePlanetActiveItemsMessage } from "../../shared/messages/tracking/empire";
import { ItemHash } from "../../shared/models/v1/ogame/items/ItemHash";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackOverviewPage(): void {
    observerCallbacks.push({
        selector: '#buffBar .active_items',
        callback: element => {
            const itemElements = element.querySelectorAll('div[data-uuid]');
            const activeItems: Partial<Record<ItemHash, number>> = {};

            const ogameNowText = (document.querySelector('meta[name="ogame-timestamp"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-timestamp');
            const ogameNow = parseIntSafe(ogameNowText, 10) * 1000;

            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            itemElements.forEach(itemElem => {
                const hash = itemElem.getAttribute('uuid') ?? _throw('no item uuid found');

                const durationLeftText = itemElem.querySelector('.js_duration')?.textContent ?? _throw('no item duration found');
                const durationLeft = parseIntSafe(durationLeftText, 10) * 1000;
                const activeUntil = ogameNow + durationLeft;

                activeItems[hash as ItemHash] = activeUntil;
            });


            const message: UpdatePlanetActiveItemsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetActiveItems,
                data: {
                    planetId,
                    items: activeItems,
                },
            };
            chrome.runtime.sendMessage(message);
        },
    });
}