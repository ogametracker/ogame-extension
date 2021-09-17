import LanguageKey from '@/i18n/languageKey';
import ExpoSize from '@/models/expeditions/ExpoSize';
import de from './de';
import en from './en';
import dk from './dk';
import { I18nFullMessageMap } from '@/i18n/types';

export interface I18nOgameExpoSizes {
    [ExpoSize.small]: string;
    [ExpoSize.medium]: string;
    [ExpoSize.large]: string;
}

const messages: I18nFullMessageMap<I18nOgameExpoSizes> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
};
export default messages;