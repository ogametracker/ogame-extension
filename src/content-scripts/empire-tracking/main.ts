import { getQueryParameters } from "../../shared/utils/getQueryParameters";
import { trackOfficers } from "./trackOfficers";
import { trackOwnedPlanets } from "./trackOwnedPlanets";
import { trackPlayerClass } from "./trackPlayerClass";
import { trackAlliancePage } from "./trackAlliancePage";
import { trackResearchPage } from "./trackResearchPage";
import { _throw } from "../../shared/utils/_throw";
import { trackSuppliesPage } from "./trackSuppliesPage";
import { trackFacilitiesPage } from "./trackFacilitiesPage";
import { trackShipyardPage } from "./trackShipyardPage";
import { trackFleetDispatchPage } from "./trackFleetDispatchPage";
import { trackDefensesPage } from "./trackDefensesPage";
import { trackOverviewPage } from "./trackOverviewPage";
import { trackResourceSettingsPage } from "./trackResourceSettingsPage";

interface PageTracker {
    condition: (queryParams: Record<string, string>) => boolean;
    action: () => void;
}

interface ObserverCallback {
    selector: string;
    callback: (element: Element) => void;
}

const queryParams = getQueryParameters(location.search);
const pageTrackers: PageTracker[] = [
    {
        action: () => {
            trackOwnedPlanets();
            trackOfficers();
            trackPlayerClass();
        },
        condition: query => ['ingame', 'messages', 'chat', 'shop', 'highscore', 'rewards', 'premium', 'resourceSettings'].includes(query.page),
    },
    {
        action: () => trackResearchPage(),
        condition: query => query.page == 'ingame' && query.component == 'research',
    },
    {
        action: () => trackSuppliesPage(),
        condition: query => query.page == 'ingame' && query.component == 'supplies',
    },
    {
        action: () => trackFacilitiesPage(),
        condition: query => query.page == 'ingame' && query.component == 'facilities',
    },
    {
        action: () => trackShipyardPage(),
        condition: query => query.page == 'ingame' && query.component == 'shipyard',
    },
    {
        action: () => trackFleetDispatchPage(),
        condition: query => query.page == 'ingame' && query.component == 'fleetdispatch',
    },
    {
        action: () => trackDefensesPage(),
        condition: query => query.page == 'ingame' && query.component == 'defenses',
    },
    {
        action: () => trackAlliancePage(),
        condition: query => query.page == 'ingame' && query.component == 'alliance',
    },
    {
        action: () => trackOverviewPage(),
        condition: query => query.page == 'ingame' && query.component == 'overview',
    },
    {
        action: () => trackResourceSettingsPage(),
        condition: query => query.page == 'resourceSettings',
    },
];
export const observerCallbacks: ObserverCallback[] = [];
const observer = new MutationObserver(() => {
    if (document.querySelector('#siteFooter') == null) {
        return;
    }

    for (let i = 0; i < observerCallbacks.length; i++) {
        const observerCallback = observerCallbacks[i];
        const elem = document.querySelector(observerCallback.selector);

        if (elem != null) {
            observerCallbacks.splice(i, 1);
            i--;
            observerCallback.callback(elem);
        }
    }

    if (observerCallbacks.length == 0) {
        observer.disconnect();
    }
});
observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
});

pageTrackers.forEach(pageTracker => {
    if (pageTracker.condition(queryParams)) {
        pageTracker.action();
    }
});
