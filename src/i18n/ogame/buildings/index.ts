import LanguageKey from '@/i18n/languageKey';
import Building from '@/models/Building';
import de from './de';
import en from './en';
import dk from './dk';

export type I18nOgameBuildings = Record<Building, string>;

const messages: Record<LanguageKey, I18nOgameBuildings> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
};
export default messages;