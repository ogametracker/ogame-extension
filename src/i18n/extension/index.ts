import LanguageKey from '../languageKey';
import de from './de';
import empire, { I18nExtensionEmpire } from './empire';
import en from './en';
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
}

const messages: Record<LanguageKey, I18nExtension> = {
    [LanguageKey.de]: {
        settings: settings.de,
        notifications: notifications.de,
        empire: empire.de,
        ...de,
    },
    [LanguageKey.en]: {
        settings: settings.en,
        notifications: notifications.en,
        empire: empire.en,
        ...en,
    },
};
export default messages;