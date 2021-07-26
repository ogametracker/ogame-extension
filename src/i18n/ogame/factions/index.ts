import LanguageKey from '@/i18n/languageKey';
import de from './de';
import en from './en';

export interface I18nOgameFactions {
    aliens: string;
    pirates: string;
}

const messages: Record<LanguageKey, I18nOgameFactions> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;