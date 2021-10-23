import { I18nMessageMap } from '@/i18n/types';
import LanguageKey from '@/i18n/languageKey';
import de from './de';
import en from './en';

export interface I18nExtensionSettings {
    name: string;
    type: string;
    rangeStarts: string;
    rangeContains: string;
    newRange: string;
    firstDay: string;
    before: string;
    days: string;
    daysVariant: string;
    weeks: string;
    weeksVariant: string;
    months: string;
    monthsVariant: string;
    rangeType: {
        day: string;
        week: string;
        month: string;
        all: string;
    };
    hintDateRanges: string;
    titleDateRanges: string;
    chartColors: {
        title: string;
        expeditions: string;
        resources: string;
        ships: string;
        combats: string;
    };
    defaultRanges: {
        today: string;
        yesterday: string;
        currentWeek: string;
        lastWeek: string;
        currentMonth: string;
    };
    titleImportExport: string;
    import: string;
    export: string;
    reset: string;
    language: string;
    detectedOgameLanguage: string;
    interfaceLanguage: string;
    exportData: string;
    importFromFile: string;
    overwriteExistingData: string;
}

const messages: I18nMessageMap<I18nExtensionSettings> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
};
export default messages;