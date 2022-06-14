import { $i18n, I18n } from '@/shared/i18n/extension/$i18n';
import { ExtensionTranslations } from '@/shared/i18n/extension/type';
import { LanguageKey } from '@/shared/i18n/LanguageKey';
import Vue from 'vue';
import { SettingsDataModule } from './data/SettingsDataModule';

// augment Vue type with localization stuff
declare module 'vue/types/vue' {
    interface Vue {
        $forceCompute(name: string): void;
        get $lang(): LanguageKey;
        get $i18n(): I18n<ExtensionTranslations, Intl.DateTimeFormatOptions>;
    }
}

Vue.prototype.$forceCompute = function(name: string) {
     this._computedWatchers[name]?.run();
};
Object.defineProperty(Vue.prototype, '$lang', {
    get: () => SettingsDataModule.settings.extensionLanguage,
});
Object.defineProperty(Vue.prototype, '$i18n', {
    get: () => $i18n,
});