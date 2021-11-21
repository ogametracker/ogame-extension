import LanguageKey from '@/i18n/languageKey';
import ExpoType from '@/models/expeditions/ExpoType';
import de from './de';
import en from './en';
import dk from './dk';
import cz from './cz';
import { I18nFullMessageMap } from '@/i18n/types';

export interface I18nOgameExpoTypes {
    [ExpoType.aliens]: string;
    [ExpoType.pirates]: string;
    [ExpoType.darkMatter]: string;
    [ExpoType.delay]: string;
    [ExpoType.early]: string;
    [ExpoType.fleet]: string;
    [ExpoType.item]: string;
    [ExpoType.lostFleet]: string;
    [ExpoType.nothing]: string;
    [ExpoType.resources]: string;
    [ExpoType.trader]: string;
}

const messages: I18nFullMessageMap<I18nOgameExpoTypes> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
    [LanguageKey.cz]: cz,
};
export default messages;