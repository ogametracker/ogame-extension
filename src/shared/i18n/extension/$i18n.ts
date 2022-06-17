import { _throw } from "@/shared/utils/_throw";
import { format } from "date-fns";
import { Component, Vue } from "vue-property-decorator";
import { LanguageKey } from "../LanguageKey";
import { ExtensionTranslations } from "./type";
import extensionMessages from './';

type I18nDateTimeFormatKey = 'date' | 'datetime' | 'time' | 'time_hm';

type I18nLanguageRootMap<TRoot> = Partial<Record<LanguageKey, TRoot>>;
type I18nDateTimeFormats<T> = Partial<Record<I18nDateTimeFormatKey, T>>;
export type I18nDateTimeFormat = string | Intl.DateTimeFormatOptions;

export interface I18nOptions<TMessages, TDateTimeFormats> {
    fallbackLocale: LanguageKey;
    messages: Partial<Record<LanguageKey, Partial<TMessages>>>;
    dateTimeFormats: I18nDateTimeFormatMap<TDateTimeFormats>;
}

type PartialLanguageKey = Exclude<LanguageKey, 'de'>;
export type I18nDateTimeFormatMap<T> = { [LanguageKey.de]: I18nDateTimeFormats<T> } & Partial<Record<PartialLanguageKey, I18nDateTimeFormats<T>>>;
export type I18nMessageMap<T> = { [LanguageKey.de]: T } & Partial<Record<PartialLanguageKey, T>>;
export type I18nFullMessageMap<T> = Record<LanguageKey, T>;

class I18nMessageProxy<TMessages, TDateTimeFormats extends I18nDateTimeFormat> {
    private readonly $i18n: I18n<TMessages, TDateTimeFormats>;

    constructor(i18n: I18n<TMessages, TDateTimeFormats>, messages: I18nLanguageRootMap<TMessages>) {
        this.$i18n = i18n;

        this.transformI18nObject(messages);
    }

    private transformI18nObject(obj: I18nLanguageRootMap<TMessages>) {
        const keys = Object.keys(obj) as LanguageKey[];
        keys.forEach(key => {
            this.transform(
                this as any,
                obj[key] as any,
                key
            );
        });
    }

    private transform(root: I18nLanguageRootMap<TMessages>, obj: any, lang: LanguageKey) {
        Object.keys(obj).forEach(key => {
            const value = obj[key];

            const fieldKey = `$${key}`;
            const localRoot = ((root as any)[fieldKey] ??= {}) as any;

            if (value instanceof Object && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
                this.transform(localRoot, value, lang);

                if (!Object.getOwnPropertyNames(root).includes(key)) {
                    Object.defineProperty(root, key, {
                        get: () => {
                            this.$i18n.throwOnDisabled();

                            const self = root as any;
                            return self[fieldKey];
                        }
                    });
                }
            } else {
                localRoot[lang] = value;

                if (!Object.getOwnPropertyNames(root).includes(key)) {
                    Object.defineProperty(root, key, {
                        get: () => {
                            this.$i18n.throwOnDisabled();

                            const self = root as any;
                            return self[fieldKey][this.$i18n.locale]
                                ?? self[fieldKey][this.$i18n.fallbackLocale]
                                ?? self[fieldKey][LanguageKey.de];
                        }
                    });
                }
            }
        });
    }
}

@Component({})
export class I18n<TMessages, TDateTimeFormats extends I18nDateTimeFormat> extends Vue {
    public enabled = true;
    public locale = LanguageKey.de;
    public fallbackLocale = LanguageKey.de;

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
        this.locale = options.fallbackLocale;
        this.fallbackLocale = options.fallbackLocale;

        this.$t = new I18nMessageProxy<TMessages, TDateTimeFormats>(this, options.messages as any) as any;
        this.dateTimeFormats = new I18nMessageProxy<any, TDateTimeFormats>(this, options.dateTimeFormats as any) as any;

        return this;
    }

    public throwOnDisabled() {
        if (!this.enabled) {
            throw new Error('I18n object is disabled');
        }
    }

    public $d(date: number | Date, formatName: I18nDateTimeFormatKey): string {
        this.throwOnDisabled();

        const dateFormat = this.dateTimeFormats[formatName] ?? _throw(`unknown datetime format key "${formatName}"`);

        if (typeof dateFormat === 'string') {
            return format(date, dateFormat);
        }

        return new Intl.DateTimeFormat(this.locale, dateFormat as Intl.DateTimeFormatOptions).format(date);
    }

    public $n(number: number, options?: Intl.NumberFormatOptions): string {
        this.throwOnDisabled();

        const formatter = new Intl.NumberFormat(this.locale, options);
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
    fallbackLocale: LanguageKey.en,
});