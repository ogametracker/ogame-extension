import LanguageKey from '@/i18n/languageKey';
import de from './de';

export interface I18nOgameItems {
    _?: never; //TODO: remove
}

const messages: Record<LanguageKey, I18nOgameItems> = {
    [LanguageKey.de]: de,
};
export default messages;