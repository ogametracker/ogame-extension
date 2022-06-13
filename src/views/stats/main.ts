import '@mdi/font/css/materialdesignicons.min.css';
import './styles/styles.scss';

import './components/common';
import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import './i18n/Localization-vue';
import './extend-vue';
import { SettingsDataModule } from './data/SettingsDataModule';

void init();


async function init() {
    await applyRouteSettings();
    mountVue();
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

    new Vue({
        router,
        render: h => h(App)
    }).$mount('#app');
}

