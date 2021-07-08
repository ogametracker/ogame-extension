import LanguageKey from '@/i18n/languageKey';
import de from './de';

export interface I18nExtensionSettings {
    name: string;
    type: string;
    rangeStarts: string;
    rangeContains: string;
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
    },
    hintDateRanges: string;
}

const messages: Record<LanguageKey, I18nExtensionSettings> = {
    [LanguageKey.de]: de,
};
export default messages;