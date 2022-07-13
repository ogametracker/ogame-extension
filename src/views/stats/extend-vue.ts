import { $i18n } from '@/shared/i18n/extension/$i18n';
import Vue from 'vue';
import Component from 'vue-class-component';
import { SettingsDataModule } from './data/SettingsDataModule';

Vue.prototype.$forceCompute = function(name: string) {
     this._computedWatchers[name]?.run();
};
Object.defineProperty(Vue.prototype, '$lang', {
    get: () => SettingsDataModule.settings.extensionLanguage,
});
Object.defineProperty(Vue.prototype, '$i18n', {
    get: () => $i18n,
});


Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate',
]);