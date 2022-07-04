import { $i18n } from '@/shared/i18n/extension/$i18n';
import Vue from 'vue';

Vue.prototype.$forceCompute = function(name: string) {
     this._computedWatchers[name]?.run();
};
Object.defineProperty(Vue.prototype, '$lang', {
    get: () => navigator.language,
});
Object.defineProperty(Vue.prototype, '$i18n', {
    get: () => $i18n,
});