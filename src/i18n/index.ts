import { format } from "date-fns";
import Vue from "vue";
import LanguageKey from "./languageKey";
import messages, { I18nMessages } from './messages';

export interface I18nDateFormats {
    short: string;
    long: string;
}

class I18n {
    public locale: LanguageKey = LanguageKey.de;
    private _messages = messages;
    private _dateTimeFormats: Record<LanguageKey, I18nDateFormats> = {
        [LanguageKey.de]: {
            short: 'dd.MM.yyyy',
            long: 'dd.MM.yyyy HH:mm:ss',
        },
    };

    public get messages(): I18nMessages {
        return this._messages[this.locale];
    }

    public get dateTimeFormats(): I18nDateFormats {
        return this._dateTimeFormats[this.locale];
    }

    public formatDate(date: number | Date, formatName: keyof I18nDateFormats): string {
        const dateFormat = this._dateTimeFormats[this.locale][formatName];

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