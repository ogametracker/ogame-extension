import LanguageKey from '@/i18n/languageKey';
import ExpoSize from '@/models/expeditions/ExpoSize';
import ExpoType from '@/models/expeditions/ExpoType';
import de from './de';
import en from './en';

export interface I18nOgameExpoMessages {
    [ExpoType.darkMatter]: {
        [ExpoSize.small]: string[];
        [ExpoSize.medium]: string[];
        [ExpoSize.large]: string[];
        regex: RegExp;
    };

    [ExpoType.resources]: {
        [ExpoSize.small]: string[];
        [ExpoSize.medium]: string[];
        [ExpoSize.large]: string[];
        regex: RegExp;
    };

    [ExpoType.fleet]: {
        [ExpoSize.small]: string[];
        [ExpoSize.medium]: string[];
        [ExpoSize.large]: string[];
        regex: RegExp;
    };

    [ExpoType.pirates]: {
        [ExpoSize.small]: string[];
        [ExpoSize.medium]: string[];
        [ExpoSize.large]: string[];
    };

    [ExpoType.aliens]: {
        [ExpoSize.small]: string[];
        [ExpoSize.medium]: string[];
        [ExpoSize.large]: string[];
    };

    [ExpoType.nothing]: string[];
    [ExpoType.lostFleet]: string[];
    [ExpoType.trader]: string[];
    [ExpoType.early]: string[];
    [ExpoType.delay]: string[];
    [ExpoType.item]: {
        regex: RegExp;
    };
}

const messages: Record<LanguageKey, I18nOgameExpoMessages> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;