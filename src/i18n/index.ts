import Vue from "vue";
import { I18n } from "./classes";
import LanguageKey from "./languageKey";

import ogameMessages, { I18nOgame } from "./ogame";
const ogameI18n = new I18n<I18nOgame>({
    messages: ogameMessages,
    dateTimeFormats: {},
    fallbackLocale: LanguageKey.de,
});

import extensionMessages, { I18nExtension } from "./extension";
const extensionI18n = new I18n<I18nExtension>({
    messages: extensionMessages,
    dateTimeFormats: {},
    fallbackLocale: LanguageKey.de,
});
Vue.prototype.$i18n = extensionI18n;

export {
    ogameI18n,
    extensionI18n,
};
