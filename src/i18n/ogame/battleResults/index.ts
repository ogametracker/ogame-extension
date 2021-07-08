import LanguageKey from '@/i18n/languageKey';
import de from './de';

export interface I18nOgameBattleResults {
    draw: string;
    lost: string;
    won: string;
}

const messages: Record<LanguageKey, I18nOgameBattleResults> = {
    [LanguageKey.de]: de,
};
export default messages;