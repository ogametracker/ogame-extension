import LanguageKey from '@/i18n/languageKey';
import de from './de';
import en from './en';

export interface I18nNotificationText {
    title: string;
    text: string;
}

export interface I18nNotificationFunc {
    title: string;
    text: ((n: number) => string);
}

export interface I18nExtensionNotifications {
    settingsSaved: I18nNotificationText;
    migration: {
        inProgress: I18nNotificationText;
        success: I18nNotificationText;
        error: I18nNotificationText;
    };
    combats: {
        success: I18nNotificationFunc;
        error: I18nNotificationFunc;
    };
    debrisFields: {
        success: I18nNotificationFunc;
        error: I18nNotificationFunc;
    };
    expeditions: {
        success: I18nNotificationFunc;
        error: I18nNotificationFunc;
        fleetLost: I18nNotificationText;
    };
}

const messages: Record<LanguageKey, I18nExtensionNotifications> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;