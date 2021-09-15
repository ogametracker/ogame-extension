import _throw from "@/utils/throw";
import { format } from "date-fns";
import LanguageKey from "./languageKey";

export interface I18nDateFormats {
    short: string;
    long: string;
}

type I18nLanguageRootMap = Partial<Record<LanguageKey, I18nRootTranslations>>;
type I18nRootTranslations = I18nTranslationObject;
type I18nTranslation = I18nTranslationObject | string;
interface I18nTranslationObject {
    [key: string]: I18nTranslation;
}

export interface I18nDateTimeFormats {
    short: string;
    long: string;
}

export type I18nDateTimeFormatMap = Partial<Record<LanguageKey, Partial<I18nDateTimeFormats>>>;

export interface I18nOptions<TMessages> {
    fallbackLocale: LanguageKey;
    messages: Partial<Record<LanguageKey, Partial<TMessages>>>;
    dateTimeFormats: I18nDateTimeFormatMap;
}

class I18nMessageProxy<TMessages> {
    private readonly $i18n: I18n<TMessages>;

    constructor(i18n: I18n<TMessages>, messages: I18nLanguageRootMap) {
        this.$i18n = i18n;

        this.transformI18nObject(messages);
    }

    private transformI18nObject(obj: I18nLanguageRootMap) {
        const keys = Object.keys(obj) as LanguageKey[];
        keys.forEach(key => {
            this.transform(
                this as any,
                obj[key] as I18nTranslationObject,
                key
            );
        });
    }

    private transform(root: I18nRootTranslations, obj: I18nTranslationObject, lang: LanguageKey) {
        Object.keys(obj).forEach(key => {
            const value = obj[key];

            const fieldKey = `$${key}`;
            const localRoot = (root[fieldKey] ??= {}) as I18nTranslationObject;

            if (value instanceof Object) {
                this.transform(localRoot, value, lang);

                if (!Object.getOwnPropertyNames(root).includes(key)) {
                    Object.defineProperty(root, key, {
                        get: () => {
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
                            const self = root as any;
                            return self[fieldKey][this.$i18n.locale] ?? self[fieldKey][this.$i18n.fallbackLocale];
                        }
                    });
                }
            }
        });
    }
}

export class I18n<TMessages> {
    public locale: LanguageKey;
    public fallbackLocale: LanguageKey;

    /* we trick typescript here, it think the object looks like this
     * { key: 'value' } (or recursive like this)
     * but in reality the object looks like this:
     * { 
     *    get key: <returns the value of the current locale or the fallbackLocale>
     * }
     */
    public readonly $t: TMessages;

    /* we trick typescript here, it think the object looks like this
     * { key: 'value' } (or recursive like this)
     * but in reality the object looks like this:
     * { 
     *    get key: <returns the value of the current locale or the fallbackLocale>
     * }
     */
    public readonly dateTimeFormats: I18nDateTimeFormats;

    private readonly _dateTimeFormats: I18nDateTimeFormatMap;

    constructor(options: I18nOptions<TMessages>) {
        this.locale = options.fallbackLocale;
        this.fallbackLocale = options.fallbackLocale;

        this.$t = new I18nMessageProxy<TMessages>(this, options.messages as any) as any;
        this._dateTimeFormats = options.dateTimeFormats;
        this.dateTimeFormats = new I18nMessageProxy(this, options.dateTimeFormats as any) as any;
    }

    public $d(date: number | Date, formatName: keyof I18nDateFormats): string {
        const dateFormat = this._dateTimeFormats[this.locale]?.[formatName]
            ?? this._dateTimeFormats[this.fallbackLocale]?.[formatName]
            ?? _throw(`unknown datetime format key "${formatName}"`);

        return format(date, dateFormat);
    }

    public $n(number: number, options?: Intl.NumberFormatOptions): string {
        const formatter = new Intl.NumberFormat(this.locale, options);
        return formatter.format(number);
    }
}