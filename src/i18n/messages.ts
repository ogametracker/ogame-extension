import { I18nExtension } from "./extension";
import LanguageKey from "./languageKey";
import { I18nOgame } from "./ogame";
import extension from './extension';
import ogame from './ogame';

export interface I18nMessages {
    extension: I18nExtension;
    ogame: I18nOgame;
}

const messages: Record<LanguageKey, I18nMessages> = Object.values(LanguageKey)
    .map(lang => {
        const msg: { [lang]: I18nMessages } = {
            [lang]: {
                extension: extension[lang],
                ogame: ogame[lang],
            }
        };
        return msg;
    }).reduce((acc, cur) => ({
        ...acc,
        ...cur,
    }), {} as Record<LanguageKey, I18nMessages>);

export default messages;