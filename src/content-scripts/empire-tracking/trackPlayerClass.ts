import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";
import { PlayerClass } from "../../shared/models/v1/ogame/classes/PlayerClass";
import { UpdatePlayerClassMessage } from "../../shared/messages/tracking/empire";
import { getOgameMeta } from "../../shared/ogame-web/getOgameMeta";
import { MessageType } from "../../shared/messages/MessageType";

export function trackPlayerClass() {
    observerCallbacks.push({
        selector: '#characterclass',
        callback: element => {
            const classDiv = element.querySelector('div.characterclass') ?? _throw('no character class element found');

            let playerClass = PlayerClass.none;
            if (classDiv.classList.contains('explorer')) {
                playerClass = PlayerClass.discoverer;
            } else if (classDiv.classList.contains('warrior')) {
                playerClass = PlayerClass.general;
            } else if (classDiv.classList.contains('miner')) {
                playerClass = PlayerClass.collector;
            }

            const message: UpdatePlayerClassMessage = {
                ogameMeta: getOgameMeta(),
                type: MessageType.UpdatePlayerClass,
                data: playerClass,
            };
            chrome.runtime.sendMessage(message);
        },
    });
}