import { getNumericEnumValues } from "../../shared/utils/getNumericEnumValues";
import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";
import { DefenseType} from '../../shared/models/v1/ogame/defenses/DefenseType';
import { parseIntSafe } from "../../shared/utils/parseNumbers";
import { UpdatePlanetDefenseCountsMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { MessageType } from "../../shared/messages/MessageType";

export function trackDefensesPage() {
    observerCallbacks.push({
        selector: '#technologies > .icons',
        callback: element => { 
            const defenseTypes = getNumericEnumValues<DefenseType>(DefenseType);
            const defenseCounts = {} as Record<DefenseType, number>;

            defenseTypes.forEach(defense => {
                const amountText = element.querySelector(`[data-technology="${defense}"] .amount`)?.getAttribute('data-value')
                    ?? _throw(`did not find amount of defense '${DefenseType[defense]}'`);

                const amount = parseIntSafe(amountText, 10);
                defenseCounts[defense] = amount;
            });

            const message: UpdatePlanetDefenseCountsMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlanetDefenseCounts,
                data: defenseCounts,
            };
            chrome.runtime.sendMessage(message);
        },
    });
}