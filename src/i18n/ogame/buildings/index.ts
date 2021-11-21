import LanguageKey from '@/i18n/languageKey';
import Building from '@/models/Building';
import de from './de';
import en from './en';
import dk from './dk';
import cz from './cz';
import { I18nFullMessageMap } from '@/i18n/types';

export type I18nOgameBuildings = Record<Building, string>;

const messages: I18nFullMessageMap<I18nOgameBuildings> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
    [LanguageKey.cz]: cz,
};
export default messages;