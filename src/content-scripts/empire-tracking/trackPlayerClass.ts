import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";
import { PlayerClass } from "../../shared/models/v1/ogame/classes/PlayerClass";

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

            //TODO: send message with updated player class
            _throw('TODO: send message with updated player class', playerClass);
        },
    });
}