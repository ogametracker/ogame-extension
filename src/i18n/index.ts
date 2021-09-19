import Vue from "vue";
import { I18n } from "./types";
import LanguageKey from "./languageKey";

import ogameMessages, { I18nOgame } from "./ogame";
const ogameI18n = new I18n<I18nOgame, string>().init({
    messages: ogameMessages,
    dateTimeFormats: {
        // this is the only date format that ogame uses
        de: {
            short: 'dd.MM.yyyy',
            long: 'dd.MM.yyyy HH:mm:ss',
        },
    },
    fallbackLocale: LanguageKey.de,
});

import extensionMessages, { I18nExtension } from "./extension";
const extensionI18n = new I18n<I18nExtension, Intl.DateTimeFormatOptions>().init({
    messages: extensionMessages,
    dateTimeFormats: {
        //always fallback to de because it will use the current locale anyways
        de: {
            short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            },
            long: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',

                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            },
        },

    },
    fallbackLocale: LanguageKey.de,
});
Vue.prototype.$i18n = extensionI18n;

export {
    ogameI18n,
    extensionI18n,
};
