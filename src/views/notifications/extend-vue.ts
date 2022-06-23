import { $i18n, I18n } from '@/shared/i18n/extension/$i18n';
import Vue from 'vue';
import { SettingsDataModule } from '../stats/data/SettingsDataModule';// yes, we import from the stats view. Should probably be in the "shared" directory

Vue.prototype.$forceCompute = function(name: string) {
     this._computedWatchers[name]?.run();
};
Object.defineProperty(Vue.prototype, '$lang', {
    get: () => SettingsDataModule.settings.extensionLanguage,
});
Object.defineProperty(Vue.prototype, '$i18n', {
    get: () => $i18n,
});