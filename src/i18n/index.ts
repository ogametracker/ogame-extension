import messages from "./messages";
import { format } from "date-fns";
import Vue from "vue";

class I18n {
    public locale = 'de';
    private _fallbackLocale = 'de';
    private _messages: Record<string, any> = messages;
    private _dateTimeFormats: Record<string, any> = {
        de: {
            short: 'dd.MM.yyyy',
            long: 'dd.MM.yyyy HH:mm:ss',
        },
    };

    public get messages(): any {
        return this._messages[this.locale] ?? this._messages[this._fallbackLocale];
    }

    public get dateTimeFormats(): any {
        return this._dateTimeFormats[this.locale] ?? this._dateTimeFormats[this._fallbackLocale];
    }

    public formatDate(date: number | Date, formatName: string) {
        const dateFormat: string | undefined = this._dateTimeFormats[this.locale]?.[formatName]
            ?? this._dateTimeFormats[this._fallbackLocale]?.[formatName];

        if (dateFormat == null) {
            throw new Error('Unknown date format');
        }

        return format(date, dateFormat);
    }

    public formatNumber(number: number) {
        const formatter = new Intl.NumberFormat(this.locale);
        return formatter.format(number);
    }
}

const i18n = new I18n();
Object.defineProperty(Vue.prototype, '$i18n', {
    get() { return i18n; }
});

export default i18n;