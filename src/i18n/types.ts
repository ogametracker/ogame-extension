import _throw from "@/utils/throw";
import { format } from "date-fns";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import LanguageKey, { PartialLanguageKey } from "./languageKey";

type I18nDateTimeFormatKey = 'date' | 'datetime';

type I18nLanguageRootMap<TRoot> = Partial<Record<LanguageKey, TRoot>>;
type I18nDateTimeFormats<T> = Record<I18nDateTimeFormatKey, T>;
export type I18nDateTimeFormat = string | Intl.DateTimeFormatOptions;

export interface I18nOptions<TMessages, TDateTimeFormats> {
    fallbackLocale: LanguageKey;
    messages: Partial<Record<LanguageKey, Partial<TMessages>>>;
    dateTimeFormats: I18nDateTimeFormatMap<TDateTimeFormats>;
}

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
}