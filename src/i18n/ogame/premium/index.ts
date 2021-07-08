import LanguageKey from '@/i18n/languageKey';
import de from './de';

export interface I18nOgamePremium {
    darkMatter: string;
}

const messages: Record<LanguageKey, I18nOgamePremium> = {
    [LanguageKey.de]: de,
};
export default messages;