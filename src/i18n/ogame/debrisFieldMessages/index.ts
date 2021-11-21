import LanguageKey from '@/i18n/languageKey';
import dk from './dk';
import de from './de';
import en from './en';
import cz from './cz';
import { I18nFullMessageMap } from '@/i18n/types';

export interface I18nOgameDebrisFieldMessages {
    regex: RegExp;
}

const messages: I18nFullMessageMap<I18nOgameDebrisFieldMessages> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
    [LanguageKey.cz]: cz,
};
export default messages;