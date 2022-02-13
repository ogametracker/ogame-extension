import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackFacilitiesPage() {
    observerCallbacks.push({
        selector: '#technologies > .icons',
        callback: element => {
            //TODO: track facility building levels
            _throw('TODO: track facility building levels');
        },
    });
}