import { _throw } from "../../shared/utils/_throw";
import { observerCallbacks } from "./main";

export function trackEmpirePage() {
    observerCallbacks.push({
        selector: '#siteFooter',
        callback: () => {
            const scripts = Array.from(document.querySelectorAll('script')) as HTMLScriptElement[];
            const script = scripts.find(s => s.textContent?.includes('createImperiumHtml(') ?? false) 
                ?? _throw('did not find script with imperium data');
            
            //TODO: get and parse imperium data
            _throw('TODO: get and parse imperium data', script);

            //TODO: send updates to service worker for every planet/moon
            _throw('TODO: send updates to service worker for every planet/moon');
        },
    });
}