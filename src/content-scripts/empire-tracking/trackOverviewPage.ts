import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackOverviewPage(): void {
    observerCallbacks.push({
        selector: '#planet',
        callback: element => {
            //TODO: track planet items
            _throw('TODO: track planet items');
        },
    });
}