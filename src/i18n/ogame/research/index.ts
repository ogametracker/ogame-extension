import LanguageKey from '@/i18n/languageKey';
import Research from '@/models/Research';
import de from './de';
import en from './en';
import dk from './dk';
import { I18nFullMessageMap } from '@/i18n/types';

export type I18nOgameResearch = Record<Research, string>;

const messages: I18nFullMessageMap<I18nOgameResearch> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
};
export default messages;