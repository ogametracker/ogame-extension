import { observerCallbacks } from "./main";
import { getNumericEnumValues } from '../../shared/utils/getNumericEnumValues';
import { ResearchType } from '../../shared/models/v1/ogame/research/ResearchType';
import { _throw } from "../../shared/utils/_throw";
import { parseIntSafe } from "../../shared/utils/parseNumbers";

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

            //TODO: send message with updated research levels
            _throw('TODO: send message with updated research levels', researchLevels);
        },
    });
}