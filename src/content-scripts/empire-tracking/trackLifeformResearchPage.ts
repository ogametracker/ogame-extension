import { observerCallbacks } from "./main";
import { _throw } from "../../shared/utils/_throw";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { UpdatePlanetActiveLifeformTechnologyLevelsMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { MessageType } from "../../shared/messages/MessageType";
import { sendMessage } from "@/shared/communication/sendMessage";
import { empireTrackingUuid } from "@/shared/uuid";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";

export function trackLifeformResearchPage() {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {
            const planetIdText = (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            const technologyLevels: Partial<Record<LifeformTechnologyType, number>> = {};

            LifeformTechnologyTypes.forEach(tech => {
                const levelText = element.querySelector(`[data-technology="${tech}"] .level`)?.getAttribute('data-value');
                if (levelText == null) {
                    return; // lifeform technology not active, don't track
                }

                const level = parseIntSafe(levelText, 10);
                technologyLevels[tech] = level;
            });

            const message: UpdatePlanetActiveLifeformTechnologyLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetActiveLifeformTechnologyLevels,
                data: {
                    isMoon: false,
                    planetId,
                    data: technologyLevels,
                },
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}