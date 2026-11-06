import { observerCallbacks } from './main';
import { ResearchType } from '@ogame-tracker/shared/models/ogame/research/ResearchType';
import { ResearchTypes } from '@ogame-tracker/shared/models/ogame/research/ResearchTypes';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';
import { UpdateResearchLevelsMessage } from '@ogame-tracker/shared/messages/tracking/empire';
import { getOgameMeta } from '@ogame-tracker/shared/ogame-web/getOgameMeta';
import { MessageType } from '@ogame-tracker/shared/messages/MessageType';
import { sendMessage } from '@ogame-tracker/shared/communication/sendMessage';
import { empireTrackingUuid } from '@ogame-tracker/shared/uuid';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';

export function trackResearchPage() {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {
            const researchLevels = createRecord(ResearchTypes, 0);

            ResearchTypes.forEach(research => {
                const levelText =
                    element.querySelector(`[data-technology="${research}"] .level`)?.getAttribute('data-value') ??
                    _throw(`did not find level of research '${ResearchType[research]}'`);
                const level = parseIntSafe(levelText, 10);

                researchLevels[research] = level;
            });

            const message: UpdateResearchLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateResearchLevels,
                data: researchLevels,
                senderUuid: empireTrackingUuid,
            };
            sendMessage(message);
        },
    });
}
