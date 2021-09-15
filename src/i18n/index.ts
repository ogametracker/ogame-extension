import Vue from "vue";
import { I18n } from "./classes";
import LanguageKey from "./languageKey";

import ogameMessages, { I18nOgame } from "./ogame";
const ogameI18n = new I18n<I18nOgame>({
    messages: ogameMessages,
    dateTimeFormats: {},
    fallbackLocale: LanguageKey.de,
});
Object.defineProperty(Vue.prototype, '$ogame', {
    get() { return ogameI18n; }
});

import extensionMessages, { I18nExtension } from "./extension";
const extensionI18n = new I18n<I18nExtension>({
    messages: extensionMessages,
    dateTimeFormats: {},
    fallbackLocale: LanguageKey.de,
});
Object.defineProperty(Vue.prototype, '$extension', {
    get() { return extensionI18n; }
});

export {
    ogameI18n,
    extensionI18n,
};
