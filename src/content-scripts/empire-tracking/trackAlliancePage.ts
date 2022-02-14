import { observerCallbacks } from "./main";
import { AllianceClass } from '../../shared/models/v1/ogame/classes/AllianceClass';
import { _throw } from "../../shared/utils/_throw";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { UpdateAllianceClassMessage } from "../../shared/messages/tracking/empire";
import { MessageType } from "../../shared/messages/MessageType";

export function trackAlliancePage(): void {
    observerCallbacks.push({
        selector: '#alliance .alliance_wrapper',
        callback: element => {
            const observer = new MutationObserver(() => {
                const allianceClassElem = element.querySelector('#allyData .allianceclass');
                if (allianceClassElem == null) {
                    return;
                }

                let allianceClass = AllianceClass.none;
                if (allianceClassElem.classList.contains('trader')) {
                    allianceClass = AllianceClass.trader;
                } else if (allianceClassElem.classList.contains('explorer')) {
                    allianceClass = AllianceClass.researcher;
                } else if (allianceClassElem.classList.contains('warrior')) {
                    allianceClass = AllianceClass.warrior;
                }

                const message: UpdateAllianceClassMessage = {
                    ogameMeta: getOgameMeta(),
                    type: MessageType.UpdateAllianceClass,
                    data: allianceClass,
                };
                chrome.runtime.sendMessage(message);
            });
            observer.observe(element, { childList: true, subtree: true });
        },
    });
}