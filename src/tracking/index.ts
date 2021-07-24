import getQueryParameters from "@/utils/getQueryParameters";
import { startLocalPlayerTracking } from "./trackLocalPlayer";
import startMessageTracking from "./trackMessages";

export function startTracking()  {
    const queryParams = getQueryParameters(window.location);

    startMessageTracking(queryParams);
    startLocalPlayerTracking(queryParams);
}