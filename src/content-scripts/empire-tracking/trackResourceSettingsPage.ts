import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackResourceSettingsPage(): void {
    observerCallbacks.push({
        selector: '#inhalt .mainRS',
        callback: element => {
            //TODO: track from resource settings
            _throw('TODO: track from resource settings');
        },
    });
}
