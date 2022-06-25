import { getQueryParameters } from "../../shared/utils/getQueryParameters";
import { initExpeditionTracking } from "./expedition-tracking";
import { initDebrisFieldReportTracking } from "./debris-field-report-tracking";
import { initCombatReportTracking } from "./combat-report-tracking";
import { loadSettings } from "@/shared/models/settings/loadSettings";
import { LanguageKey } from "@/shared/i18n/LanguageKey";
import { getDefaultSettings } from "@/shared/models/settings/getDefaultSettings";

import './styles.scss';

const queryParams = getQueryParameters(location.search);
export const settingsWrapper = {
    settings: getDefaultSettings('__internal__' as LanguageKey),
};
if(queryParams.page == 'messages') {
    init();
}

async function init() {
    initExpeditionTracking();
    initCombatReportTracking();
    initDebrisFieldReportTracking();

    settingsWrapper.settings = await loadSettings('__internal__' as LanguageKey);
}
