import LanguageKey from '@/i18n/languageKey';
import ExpoType from '@/models/expeditions/ExpoType';
import de from './de';

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

const messages: Record<LanguageKey, I18nOgameExpoTypes> = {
    [LanguageKey.de]: de,
};
export default messages;