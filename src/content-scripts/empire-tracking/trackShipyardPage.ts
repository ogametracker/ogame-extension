import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackShipyardPage() {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {
            //TODO: track ship counts (shipyard)
            _throw('TODO: track ship counts (shipyard)');
        },
    });
}