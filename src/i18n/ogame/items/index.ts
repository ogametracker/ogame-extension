import LanguageKey from '@/i18n/languageKey';
import de from './de';
import en from './en';
import dk from './dk';
import { I18nFullMessageMap } from '@/i18n/types';

export interface I18nOgameItems {
    _?: never; //TODO: remove
}

const messages: I18nFullMessageMap<I18nOgameItems> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
};
export default messages;