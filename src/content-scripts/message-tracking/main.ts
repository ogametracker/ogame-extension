import { getQueryParameters } from "../../shared/utils/getQueryParameters";
import { initExpeditionTracking } from "./expedition-tracking";

const queryParams = getQueryParameters(location.search);
if(queryParams.page == 'messages') {
    initExpeditionTracking();
    // initCombatReportTracking();
    // initDebrisFieldReportTracking();
}