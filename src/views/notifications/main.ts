import Vue from 'vue';
import App from './App.vue';
import { SettingsDataModule } from '../stats/data/SettingsDataModule';
import { $i18n } from '@/shared/i18n/extension/$i18n';

import './extend-vue';

import '@mdi/font/css/materialdesignicons.min.css';
import '@/views/_shared/styles/index.scss';
import '@/views/_shared/components/ogame';

main();


function watchLanguage() {
    new Vue().$watch(
        () => SettingsDataModule.settings.extensionLanguage,
        lang => $i18n.locale = lang,
        { immediate: true }
    );
}

async function main() {
    await SettingsDataModule.ready;
    watchLanguage();

    Vue.config.productionTip = false;
    new Vue({
        render: h => h(App)
    }).$mount('#app');
}