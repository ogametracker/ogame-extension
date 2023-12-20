import { _throw } from "@/shared/utils/_throw";
import { format } from "date-fns";
import { Component, Vue } from "vue-property-decorator";
import { LanguageKey } from "../LanguageKey";
import { ExtensionTranslations } from "./type";
import extensionMessages from './';
import { _logWarning } from "@/shared/utils/_log";
import { RecursivePartial } from "@/shared/types/RecursivePartial";

type I18nDateTimeFormatKey = 'date' | 'datetime' | 'time' | 'time_hm';

type I18nLanguageRootMap<TRoot> = Partial<Record<LanguageKey, TRoot>>;
type I18nDateTimeFormats<T> = Partial<Record<I18nDateTimeFormatKey, T>>;
export type I18nDateTimeFormat = string | Intl.DateTimeFormatOptions;

export interface I18nOptions<TMessages, TDateTimeFormats> {
    locale: LanguageKey;
    localeRegion?: string;
    fallbackLocales: RequiredLanguageKey[];
    messages: Record<RequiredLanguageKey, TMessages> & RecursivePartial<Record<PartialLanguageKey, TMessages>>;
    dateTimeFormats: I18nDateTimeFormatMap<TDateTimeFormats>;
}

type RequiredLanguageKey = LanguageKey.de | LanguageKey.en;
type PartialLanguageKey = Exclude<LanguageKey, RequiredLanguageKey>;
export type I18nDateTimeFormatMap<T> = Record<RequiredLanguageKey, I18nDateTimeFormats<T>> & Partial<Record<PartialLanguageKey, I18nDateTimeFormats<T>>>;
export type I18nMessageMap<T> = Record<RequiredLanguageKey, T> & RecursivePartial<Record<PartialLanguageKey, T>>;
export type I18nFullMessageMap<T> = Record<LanguageKey, T>;

class I18nMessageProxy<TMessages, TDateTimeFormats extends I18nDateTimeFormat> {
    readonly #i18n: I18n<TMessages, TDateTimeFormats>;
    readonly #cache = {} as Record<LanguageKey, Record<string, any>>;

    constructor(i18n: I18n<TMessages, TDateTimeFormats>, messages: I18nLanguageRootMap<TMessages>) {
        this.#i18n = i18n;

        this.#transformI18nObject(messages);
    }

    #transformI18nObject(obj: I18nLanguageRootMap<TMessages>) {
        const keys = Object.keys(LanguageKey) as LanguageKey[];
        keys.forEach(key => {
            this.#transform(
                this as any,
                obj[key] ?? {},
                key,
                '',
            );
        });
    }

    #transform(root: I18nLanguageRootMap<TMessages>, obj: Record<string, any>, lang: LanguageKey, fullRootKey: string) {
        Object.keys(obj).forEach(key => {
            const value = obj[key];

            const fieldKey = `$${key}`;
            const localRoot = ((root as any)[fieldKey] ??= {}) as any;

            const keyPrefix = fullRootKey == '' ? '' : `${fullRootKey}.`;
            const fullKey = `${keyPrefix}${key}`;

            if (value instanceof Object && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
                this.#transform(localRoot, value, lang, fullKey);

                if (!Object.getOwnPropertyNames(root).includes(key)) {
                    Object.defineProperty(root, key, {
                        get: () => {
                            this.#i18n.throwOnDisabled();

                            const self = root as any;
                            return self[fieldKey];
                        }
                    });
                }
            } else {
                localRoot[lang] = value;

                const localeCache = (this.#cache[lang] ??= {});
                localeCache[fullKey] = value;

                if (!Object.getOwnPropertyNames(root).includes(key)) {
                    Object.defineProperty(root, key, {
                        get: () => {
                            this.#i18n.throwOnDisabled();

                            return this.#getTranslation(fullKey);
                        }
                    });
                }
            }
        });
    }

    #getTranslation(fullKey: string): string | Error {
        let result = this.#cache[this.#i18n.locale]?.[fullKey];
        if (result != null) {
            return result;
        }

        let lastLocale = this.#i18n.locale;
        for (const fallbackLocale of this.#i18n.fallbackLocales) {
            result = this.#cache[fallbackLocale]?.[fullKey];
            if (result != null) {
                return result;
            }

            lastLocale = fallbackLocale;
        }

        _throw(`$i18n: did not find key '${fullKey}' for any locale`);
    }
}

@Component({})
export class I18n<TMessages, TDateTimeFormats extends I18nDateTimeFormat> extends Vue {
    public enabled = true;
    public locale = LanguageKey.de;
    public localeRegion: string | null = null;
    private _proxy: I18nMessageProxy<TMessages, TDateTimeFormats> = null!;
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
        this._proxy = new I18nMessageProxy<TMessages, TDateTimeFormats>(this, options.messages as any);
        this.$t = this._proxy as any;
        this.dateTimeFormats = new I18nMessageProxy<any, TDateTimeFormats>(this, options.dateTimeFormats as any) as any;

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