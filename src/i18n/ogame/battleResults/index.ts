import LanguageKey from '@/i18n/languageKey';
import de from './de';
import en from './en';

export interface I18nOgameBattleResults {
    draw: string;
    lost: string;
    won: string;
}

const messages: Record<LanguageKey, I18nOgameBattleResults> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;