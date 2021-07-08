import LanguageKey from '@/i18n/languageKey';
import Resource from '@/models/Resource';
import de from './de';

export interface I18nOgameResources {
    [Resource.metal]: string;
    [Resource.crystal]: string;
    [Resource.deuterium]: string;
}

const messages: Record<LanguageKey, I18nOgameResources> = {
    [LanguageKey.de]: de,
};
export default messages;