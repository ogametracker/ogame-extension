import LanguageKey from '@/i18n/languageKey';
import de from './de';

export interface I18nOgameFactions {
    aliens: string;
    pirates: string;
}

const messages: Record<LanguageKey, I18nOgameFactions> = {
    [LanguageKey.de]: de,
};
export default messages;