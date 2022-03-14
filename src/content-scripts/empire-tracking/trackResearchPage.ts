import { observerCallbacks } from "./main";
import { getNumericEnumValues } from '../../shared/utils/getNumericEnumValues';
import { ResearchType } from '../../shared/models/ogame/research/ResearchType';
import { _throw } from "../../shared/utils/_throw";
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { UpdateResearchLevelsMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { MessageType } from "../../shared/messages/MessageType";

export function trackResearchPage() {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {
            const researchTypes = getNumericEnumValues<ResearchType>(ResearchType);
            const researchLevels = {} as Record<ResearchType, number>;

            researchTypes.forEach(research => {
                const levelText = element.querySelector(`[data-technology="${research}"] .level`)?.getAttribute('data-value') ?? _throw(`did not find level of research '${ResearchType[research]}'`);
                const level = parseIntSafe(levelText, 10);

                researchLevels[research] = level;
            });

            const message: UpdateResearchLevelsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdateResearchLevels,
                data: researchLevels,
            };
            chrome.runtime.sendMessage(message);
        },
    });
}