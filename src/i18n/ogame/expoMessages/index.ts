import LanguageKey from '@/i18n/languageKey';
import ExpoSize from '@/models/expeditions/ExpoSize';
import ExpoType from '@/models/expeditions/ExpoType';
import de from './de';
import en from './en';
import dk from './dk';
import cz from './cz';
import { I18nFullMessageMap } from '@/i18n/types';

export type RegexBuilder<T> = (value: T) => RegExp;

export interface I18nOgameExpoMessages {
    [ExpoType.darkMatter]: {
        [ExpoSize.small]: string[];
        [ExpoSize.medium]: string[];
        [ExpoSize.large]: string[];
        regex: RegexBuilder<string>;
    };

    [ExpoType.resources]: {
        [ExpoSize.small]: string[];
        [ExpoSize.medium]: string[];
        [ExpoSize.large]: string[];
        regex: RegexBuilder<string[]>;
    };

    [ExpoType.fleet]: {
        [ExpoSize.small]: string[];
        [ExpoSize.medium]: string[];
        [ExpoSize.large]: string[];
        regex: RegexBuilder<string[]>;
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

const messages: I18nFullMessageMap<I18nOgameExpoMessages> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
    [LanguageKey.cz]: cz,
};
export default messages;