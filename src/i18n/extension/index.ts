import LanguageKey from '../languageKey';
import de from './de';
import en from './en';
import settings, { I18nExtensionSettings } from './settings';

export interface I18nExtension {
    settings: I18nExtensionSettings;

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
    since: string;
    lost: string;
    destroyed: string;
}

const messages: Record<LanguageKey, I18nExtension> = {
    [LanguageKey.de]: {
        settings: settings.de,
        ...de,
    },
    [LanguageKey.en]: {
        settings: settings.en,
        ...en,
    },
};
export default messages;