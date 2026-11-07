import extensionMessages from '@ogame-tracker/shared/i18n/extension';
import { createTranslationTree } from '@ogame-tracker/shared/i18n/extension/createTranslationTree';
import type { ExtensionTranslations } from '@ogame-tracker/shared/i18n/extension/type';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
import { useSettingsStore } from './data/SettingsDataModule';

type DateTimeFormat = 'date' | 'datetime' | 'time' | 'time_hm';

const localeContext = {
    get locale() {
        return getLanguage();
    },
    fallbackLocales: [LanguageKey.en, LanguageKey.de],
};

const messages = createTranslationTree<ExtensionTranslations>(localeContext, extensionMessages);
const dateTimeFormats = createTranslationTree<Record<DateTimeFormat, Intl.DateTimeFormatOptions>>(localeContext, {
    //always fallback to de because it will use the current locale anyways
    de: {
        date: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        },
        datetime: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',

            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        },
        time: {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        },
        time_hm: {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        },
    },
    en: {
        date: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        },
        datetime: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',

            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        },
        time: {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        },
        time_hm: {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
        },
    },
});

export function translations(): ExtensionTranslations {
    return messages;
}

export function getLanguage(): LanguageKey {
    return useSettingsStore().settings?.extensionLanguage ?? LanguageKey.en;
}

export function getLocale(): string {
    const language = getLanguage();
    const region = useSettingsStore().settings?.extensionLanguageRegion;
    return region == null ? language : `${language}-${region}`;
}

export function formatDate(date: number | Date, format: DateTimeFormat): string {
    return new Intl.DateTimeFormat(getLocale(), dateTimeFormats[format]).format(date);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(getLocale(), options).format(value);
}

export function formatTimespan(valueInSeconds: number): string {
    let totalTime = BigInt(Math.ceil(valueInSeconds));

    const seconds = totalTime % 60n;
    totalTime = (totalTime - seconds) / 60n;

    const minutes = totalTime % 60n;
    totalTime = (totalTime - minutes) / 60n;

    const hours = totalTime % 24n;
    totalTime = (totalTime - hours) / 24n;

    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (totalTime == 0n) {
        return time;
    }

    const days = totalTime % 7n;
    totalTime = (totalTime - days) / 7n;

    const timeWithDays = `${days}d ` + time;
    if (totalTime == 0n) {
        return timeWithDays;
    }

    const weeks = totalTime;

    return `${formatNumber(Number(weeks))}w ` + timeWithDays;
}
