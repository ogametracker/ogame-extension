import { observerCallbacks } from "./main";
import { AllianceClass } from '../../shared/models/v1/ogame/classes/AllianceClass';
import { _throw } from "../../shared/utils/_throw";

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

                //TODO: send message with updated alliance class
                _throw('TODO: send message with updated alliance class', allianceClass);
            });
            observer.observe(element, { childList: true, subtree: true });
        },
    });
}