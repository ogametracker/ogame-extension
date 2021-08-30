import LanguageKey from '@/i18n/languageKey';
import de from './de';
import en from './en';

export interface I18nExtensionInfo {
    totalSize: string;
    trackedExpeditions: string;
    trackedCombats: string;
    trackedDebrisFieldReports: string;
}

const messages: Record<LanguageKey, I18nExtensionInfo> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;