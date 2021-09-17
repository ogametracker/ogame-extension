import LanguageKey, { PartialLanguageKey, PartialLanguages } from '../languageKey';
import battleResults, { I18nExtensionBattleResults } from './battleResults';
import de from './de';
import empire, { I18nExtensionEmpire } from './empire';
import en from './en';
import info, { I18nExtensionInfo } from './info';
import notifications, { I18nExtensionNotifications } from './notifications';
import settings, { I18nExtensionSettings } from './settings';
import ogame, { I18nOgame } from '../ogame';

export interface PartialI18nExtension extends I18nOgame {
    menuItem: string;

    settings: Partial<I18nExtensionSettings>;
    notifications: Partial<I18nExtensionNotifications>;

    total: string;
    chart: string;
    tables: string;
    overview: string;
    eventSizes: string;
    expoMenu: Partial<{
        overview: string;
        resources: string;
        fleet: string;
        darkMatter: string;
        items: string;
        distribution: string;
    }>;
    debrisFieldsMenu: {
        overview: string;
    };
    headers: Partial<{
        expeditions: string;
        battles: string;
        debrisFields: string;
        settings: string;
        resourcesOverview: string;
        empire: string;
        tools: string;
    }>;
    combats: Partial<{
        lostShips: string;
        againstPlayers: string;
        onExpeditions: string;
    }>;
    since: string;
    lost: string;
    destroyed: string;

    empire: Partial<I18nExtensionEmpire>;
    info: Partial<I18nExtensionInfo>;
    battleResults: Partial<I18nExtensionBattleResults>;
}

export interface I18nExtension extends PartialI18nExtension {
    settings: I18nExtensionSettings;
    notifications: I18nExtensionNotifications;

    expoMenu: {
        overview: string;
        resources: string;
        fleet: string;
        darkMatter: string;
        items: string;
        distribution: string;
    };
    debrisFieldsMenu: {
        overview: string;
    };
    headers: {
        expeditions: string;
        battles: string;
        debrisFields: string;
        settings: string;
        resourcesOverview: string;
        empire: string;
        tools: string;
    };
    combats: {
        lostShips: string;
        againstPlayers: string;
        onExpeditions: string;
    };

    empire: I18nExtensionEmpire;
    info: I18nExtensionInfo;
    battleResults: I18nExtensionBattleResults;
}

const splitMap = {
    settings, 
    notifications,
    empire,
    info,
    battleResults,
};

const msgs = {
    de,
    en,
};

function getSplitMap(languageKey: LanguageKey) {
    return Object.keys(splitMap).reduce((acc, key) => ({
        ...acc,
        [key]: (splitMap as any)[key][languageKey]
    }), {} as any) as any;
}

const messages: Record<LanguageKey, I18nExtension> = {
    de: {
        ...de,
        ...ogame.de,
        ...getSplitMap(LanguageKey.de),
    },
    ...Object.values(PartialLanguages).reduce((acc, lang) => ({
        ...acc,
        [lang]: {
            ...getSplitMap(lang),
            ...ogame[lang],
            ...msgs[lang],
        },
    }), {} as I18nExtension) as any,
};
export default messages;