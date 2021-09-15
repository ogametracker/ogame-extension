import LanguageKey from '../languageKey';
import battleResults, { I18nExtensionBattleResults } from './battleResults';
import de from './de';
import empire, { I18nExtensionEmpire } from './empire';
import en from './en';
import info, { I18nExtensionInfo } from './info';
import notifications, { I18nExtensionNotifications } from './notifications';
import settings, { I18nExtensionSettings } from './settings';

export interface I18nExtension {
    menuItem: string;

    settings: I18nExtensionSettings;
    notifications: I18nExtensionNotifications;

    total: string;
    chart: string;
    tables: string;
    overview: string;
    eventSizes: string;
    expoMenu: {
        overview: string;
        resources: string;
        fleet: string;
        darkMatter: string;
        items: string;
        distribution: string;
    },
    debrisFieldsMenu: {
        overview: string;
    },
    headers: {
        expeditions: string;
        battles: string;
        debrisFields: string;
        settings: string;
        resourcesOverview: string;
        empire: string;
        tools: string;
    },
    combats: {
        lostShips: string;
        againstPlayers: string;
        onExpeditions: string;
    },
    since: string;
    lost: string;
    destroyed: string;

    empire: I18nExtensionEmpire;
    info: I18nExtensionInfo;
    battleResults: I18nExtensionBattleResults;
}

const messages: Record<LanguageKey, I18nExtension> = {
    [LanguageKey.de]: {
        settings: settings.de,
        notifications: notifications.de,
        empire: empire.de,
        info: info.de,
        battleResults: battleResults.de,
        ...de,
    },
    [LanguageKey.en]: {
        settings: settings.en,
        notifications: notifications.en,
        empire: empire.en,
        info: info.en,
        battleResults: battleResults.en,
        ...en,
    },
};
export default messages;