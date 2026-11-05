import { sendMessage } from "@ogame-tracker/shared/communication/sendMessage";
import { empireTrackingUuid } from "@ogame-tracker/shared/uuid";
import { MessageType } from "@ogame-tracker/shared/messages/MessageType";
import { UpdatePlanetActiveItemsMessage } from "@ogame-tracker/shared/messages/tracking/empire";
import { PlanetActiveItems } from "@ogame-tracker/shared/models/empire/PlanetActiveItems";
import { ItemHash } from "@ogame-tracker/shared/models/ogame/items/ItemHash";
import { getOgameMeta } from "@ogame-tracker/shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "@ogame-tracker/shared/utils/parseNumbers";
import { _throw } from "@ogame-tracker/shared/utils/_throw";

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

        const planetType = (document.querySelector('meta[name="ogame-planet-type"]') as HTMLMetaElement | null)?.content
            ?? _throw('did not find meta ogame-planet-type');
        const isMoon = planetType == 'moon';

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
                    isMoon,
                    planetId,
                    data: activeItems,
                },
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
}