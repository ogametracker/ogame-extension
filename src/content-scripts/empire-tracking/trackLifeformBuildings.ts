import { sendMessage } from "@/shared/communication/sendMessage";
import { MessageType } from "@/shared/messages/MessageType";
import { UpdatePlanetActiveLifeformBuildingLevelsMessage } from "@/shared/messages/tracking/empire";
import { LifeformBuildingType, LifeformBuildingTypes } from "@/shared/models/ogame/lifeforms/LifeformBuildingType";
import { getOgameMeta } from "@/shared/ogame-web/getOgameMeta";
import { parseIntSafe } from "@/shared/utils/parseNumbers";
import { _throw } from "@/shared/utils/_throw";
import { empireTrackingUuid } from "@/shared/uuid";
import { observerCallbacks } from "./main";

export function trackLifeformBuildingsPage() {
    observerCallbacks.push({
        selector: '#technologies > .icons',
        callback: element => {
            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            const buildingLevels: Partial<Record<LifeformBuildingType, number>> = {};

            LifeformBuildingTypes.forEach(building => {
                const levelText = element.querySelector(`[data-technology="${building}"] .level`)?.getAttribute('data-value');
                if (levelText == null) {
                    return; // ignore buildings of other lifeforms which we won't find here
                }

                const level = parseIntSafe(levelText, 10);
                buildingLevels[building] = level;
            });

            const message: UpdatePlanetActiveLifeformBuildingLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetActiveLifeformBuildingLevels,
                data: {
                    isMoon: false,
                    planetId,
                    data: buildingLevels,
                },
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}