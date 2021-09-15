import expoMessages, { I18nOgameExpoMessages } from './expoMessages';
import debrisFieldMessages, { I18nOgameDebrisFieldMessages } from './debrisFieldMessages';
import expoSizes, { I18nOgameExpoSizes } from './expoSizes';
import expoTypes, { I18nOgameExpoTypes } from './expoTypes';
import resources, { I18nOgameResources } from './resources';
import ships, { I18nOgameShips } from './ships';
import premium, { I18nOgamePremium } from './premium';
import items, { I18nOgameItems } from './items';
import factions, { I18nOgameFactions } from './factions';
import LanguageKey from '../languageKey';
import buildings, { I18nOgameBuildings } from './buildings';
import research, { I18nOgameResearch } from './research';

export interface I18nOgame {
    factions: I18nOgameFactions;
    expoMessages: I18nOgameExpoMessages;
    expoSizes: I18nOgameExpoSizes;
    expoTypes: I18nOgameExpoTypes;
    resources: I18nOgameResources;
    ships: I18nOgameShips
    premium: I18nOgamePremium;
    items: I18nOgameItems;
    debrisFieldMessages: I18nOgameDebrisFieldMessages;
    buildings: I18nOgameBuildings;
    research: I18nOgameResearch;
}

const messages: Record<LanguageKey, I18nOgame> = Object.values(LanguageKey)
    .map(lang => {
        const msg: Record<LanguageKey, I18nOgame> = {
            [lang]: {
                expoMessages: expoMessages[lang],
                debrisFieldMessages: debrisFieldMessages[lang],
                expoSizes: expoSizes[lang],
                expoTypes: expoTypes[lang],
                resources: resources[lang],
                ships: ships[lang],
                premium: premium[lang],
                items: items[lang],
                factions: factions[lang],
                buildings: buildings[lang],
                research: research[lang],
            }
        } as Record<LanguageKey, I18nOgame>;
        return msg;
    }).reduce((acc, cur) => ({
        ...acc,
        ...cur,
    }), {} as Record<LanguageKey, I18nOgame>);

export default messages;