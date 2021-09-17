import LanguageKey from '@/i18n/languageKey';
import Resource from '@/models/Resource';
import de from './de';
import en from './en';
import dk from './dk';

export interface I18nOgameResources {
    [Resource.metal]: string;
    [Resource.crystal]: string;
    [Resource.deuterium]: string;
}

const messages: Record<LanguageKey, I18nOgameResources> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
};
export default messages;