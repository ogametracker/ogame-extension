import { observerCallbacks } from './main';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';
import { UpdatePlanetActiveLifeformTechnologyLevelsMessage } from '@ogame-tracker/shared/messages/tracking/empire';
import { getOgameMeta } from '@ogame-tracker/shared/ogame-web/getOgameMeta';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import { sendMessage } from '@ogame-tracker/shared/communication/sendMessage';
import { empireTrackingUuid } from '@ogame-tracker/shared/uuid';
import {
    LifeformTechnologyType,
    LifeformTechnologyTypes,
} from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';

export function trackLifeformResearchPage() {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {
            const planetIdText =
                (document.querySelector('meta[name="ogame-planet-id"]') as HTMLMetaElement | null)?.content
                ?? _throw('no meta element found for ogame-planet-id');
            const planetId = parseIntSafe(planetIdText, 10);

            const technologyLevels: Partial<Record<LifeformTechnologyType, number>> = {};

            LifeformTechnologyTypes.forEach(tech => {
                const levelText = element
                    .querySelector(`[data-technology="${tech}"] .level`)
                    ?.getAttribute('data-value');
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
