import LanguageKey from '@/i18n/languageKey';
import de from './de';
import en from './en';
import dk from './dk';
import { I18nMessageMap } from '@/i18n/types';

export interface I18nExtensionBattleResults {
    draw: string;
    lost: string;
    won: string;
}

const messages: I18nMessageMap<I18nExtensionBattleResults> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
};
export default messages;