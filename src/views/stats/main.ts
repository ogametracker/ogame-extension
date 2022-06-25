import '@mdi/font/css/materialdesignicons.min.css';
import './styles/styles.scss';

import '@/views/_shared/components/ogame';
import './components/common';
import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import './extend-vue';
import { SettingsDataModule } from './data/SettingsDataModule';
import { $i18n } from '@/shared/i18n/extension/$i18n';

void init();


async function init() {
    await applyRouteSettings();
    watchLanguage();
    mountVue();
}

function watchLanguage() {
    new Vue().$watch(
        () => SettingsDataModule.settings.extensionLanguage,
        lang => $i18n.locale = lang,
        { immediate: true }
    );
}

async function applyRouteSettings() {
    await SettingsDataModule.ready;

    const routeSettings = SettingsDataModule.settings.defaultRoutes;
    const allRoutes = router.getRoutes();

    Object.keys(routeSettings).forEach(routeName => {
        const route = allRoutes.find(route => route.name == routeName);
        if (route == null) {
            return;
        }

        route.redirect = { name: routeSettings[routeName] };
    });
}

function mountVue() {
    Vue.config.productionTip = false;

    const vue = new Vue({
        router,
        render: h => h(App)
    }).$mount('#app');
}

