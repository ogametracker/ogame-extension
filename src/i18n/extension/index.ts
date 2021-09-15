import LanguageKey from '../languageKey';
import battleResults, { I18nExtensionBattleResults } from './battleResults';
import de from './de';
import empire, { I18nExtensionEmpire } from './empire';
import en from './en';
import info, { I18nExtensionInfo } from './info';
import notifications, { I18nExtensionNotifications } from './notifications';
import settings, { I18nExtensionSettings } from './settings';
import ogame, { I18nOgame } from '../ogame';

export interface I18nExtension extends I18nOgame {
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

const splitMap = {
    settings, 
    notifications,
    empire,
    info,
    battleResults,
};

function getSplitMap(languageKey: LanguageKey) {
    return Object.keys(splitMap).reduce((acc, key) => ({
        ...acc,
        [key]: (splitMap as any)[key][languageKey]
    }), {} as any) as any;
}

const test = getSplitMap(LanguageKey.de);

const messages: Record<LanguageKey, I18nExtension> = {
    [LanguageKey.de]: {
        ...getSplitMap(LanguageKey.de),
        ...ogame.de,
        ...de,
    },
    [LanguageKey.en]: {
        ...getSplitMap(LanguageKey.en),
        ...ogame.en,
        ...en,
    },
};
export default messages;