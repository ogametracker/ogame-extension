import LanguageKey from '@/i18n/languageKey';
import de from './de';

export interface I18nOgameDebrisFieldMessages {
    regex: RegExp;
}

const messages: Record<LanguageKey, I18nOgameDebrisFieldMessages> = {
    [LanguageKey.de]: de,
};
export default messages;