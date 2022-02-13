import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackSuppliesPage() {
    observerCallbacks.push({
        selector: '#producers',
        callback: element => {
            //TODO: track supply building levels and stationary ships
            _throw('TODO: track supply building levels and stationary ships');
        },
    });
}