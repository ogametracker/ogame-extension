import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackFleetDispatchPage(): void {
    observerCallbacks.push({
        selector: '#technologies',
        callback: element => {
            //TODO: track ship counts (fleetdispatch)
            _throw('TODO: track ship counts (fleetdispatch)');
        },
    });
}