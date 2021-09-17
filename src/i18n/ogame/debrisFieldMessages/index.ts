import LanguageKey from '@/i18n/languageKey';
import dk from './dk';
import de from './de';
import en from './en';

export interface I18nOgameDebrisFieldMessages {
    regex: RegExp;
}

const messages: Record<LanguageKey, I18nOgameDebrisFieldMessages> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
};
export default messages;