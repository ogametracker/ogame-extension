import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackDefensesPage() {
    observerCallbacks.push({
        selector: '#technologies > .icons',
        callback: element => {
            //TODO: track defense counts
            _throw('TODO: track defense counts');
        },
    });
}