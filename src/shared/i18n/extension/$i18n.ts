import { _throw } from "@/shared/utils/_throw";
import { format } from "date-fns";
import { Component, Vue } from "vue-property-decorator";
import { LanguageKey } from "../LanguageKey";
import { ExtensionTranslations } from "./type";
import extensionMessages from './';
import { createTranslationTree } from "./createTranslationTree";
import { RecursivePartial } from "@/shared/types/RecursivePartial";

type I18nDateTimeFormatKey = 'date' | 'datetime' | 'time' | 'time_hm';

type I18nLanguageRootMap<TRoot> = Partial<Record<LanguageKey, TRoot>>;
type I18nDateTimeFormats<T> = Partial<Record<I18nDateTimeFormatKey, T>>;
export type I18nDateTimeFormat = string | Intl.DateTimeFormatOptions;

export interface I18nOptions<TMessages extends object, TDateTimeFormats> {
    locale: LanguageKey;
    localeRegion?: string;
    fallbackLocales: RequiredLanguageKey[];
    messages: Record<RequiredLanguageKey, TMessages> & RecursivePartial<Record<PartialLanguageKey, TMessages>>;
    dateTimeFormats: I18nDateTimeFormatMap<TDateTimeFormats>;
}

type RequiredLanguageKey = LanguageKey.de | LanguageKey.en;
type PartialLanguageKey = Exclude<LanguageKey, RequiredLanguageKey>;
export type I18nDateTimeFormatMap<T> = Record<RequiredLanguageKey, I18nDateTimeFormats<T>> & Partial<Record<PartialLanguageKey, I18nDateTimeFormats<T>>>;

@Component({})
export class I18n<TMessages extends object, TDateTimeFormats extends I18nDateTimeFormat> extends Vue {
    public enabled = true;
    public locale = LanguageKey.de;
    public localeRegion: string | null = null;
    public fallbackLocales: LanguageKey[] = [LanguageKey.en];

    /* we trick typescript here, it think the object looks like this
     * { key: 'value' } (or recursive like this)
     * but in reality the object looks like this:
     * { 
     *    get key: <returns the value of the current locale or the fallbackLocale>
     * }
     */
    public $t: TMessages = null!;

    /* we trick typescript here, it think the object looks like this
     * { key: 'value' } (or recursive like this)
     * but in reality the object looks like this:
     * { 
     *    get key: <returns the value of the current locale or the fallbackLocale>
     * }
     */
    public dateTimeFormats: I18nDateTimeFormats<TDateTimeFormats> = null!;

    public init(options: I18nOptions<TMessages, TDateTimeFormats>): I18n<TMessages, TDateTimeFormats> {
        this.$t = createTranslationTree<TMessages>(this, options.messages);
        this.dateTimeFormats = createTranslationTree<I18nDateTimeFormats<TDateTimeFormats>>(this, options.dateTimeFormats);

        this.locale = options.locale;
        this.localeRegion = options.localeRegion ?? null;
        this.fallbackLocales = options.fallbackLocales;

        return this;
    }

    public throwOnDisabled() {
        if (!this.enabled) {
            throw new Error('I18n object is disabled');
        }
    }

    public get fullLocaleIdentifier(): string {
        if(this.localeRegion == null) {
            return this.locale;
        }

        return `${this.locale}-${this.localeRegion}`;
    }

    public $d(date: number | Date, formatName: I18nDateTimeFormatKey): string {
        this.throwOnDisabled();

        const dateFormat = this.dateTimeFormats[formatName] ?? _throw(`unknown datetime format key "${formatName}"`);

        if (typeof dateFormat === 'string') {
            return format(date, dateFormat);
        }

        return new Intl.DateTimeFormat(this.fullLocaleIdentifier, dateFormat as Intl.DateTimeFormatOptions).format(date);
    }

    public $n(number: number, options?: Intl.NumberFormatOptions): string {
        this.throwOnDisabled();

        const formatter = new Intl.NumberFormat(this.fullLocaleIdentifier, options);
        return formatter.format(number);
    }

    public $timespan(valueInSeconds: number): string {
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

        return `${this.$n(Number(weeks))}w ` + timeWithDays;
    }
}

export const $i18n = new I18n<ExtensionTranslations, Intl.DateTimeFormatOptions>().init({
    messages: extensionMessages,
    dateTimeFormats: {
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
    },
    locale: LanguageKey.en,
    fallbackLocales: [LanguageKey.en, LanguageKey.de],
});