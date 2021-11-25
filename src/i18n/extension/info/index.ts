import { I18nMessageMap } from '@/i18n/types';
import LanguageKey from '@/i18n/languageKey';
import de from './de';
import en from './en';

export interface I18nExtensionInfo {
    totalSize: string;
    trackedExpeditions: string;
    trackedCombats: string;
    trackedDebrisFieldReports: string;
    infoFirefoxBug: string;
}

const messages: I18nMessageMap<I18nExtensionInfo> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;