import '@/views/_shared/styles/index.scss';

import '@/views/_shared/components/common';
import '@/views/_shared/components/ogame';
import './components/common';

import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import './extend-vue';
import { SettingsDataModule } from './data/SettingsDataModule';
import { $i18n } from '@/shared/i18n/extension/$i18n';
import { addIconFonts } from '../_shared/addIconFonts';

void init();


async function init() {
    addIconFonts();
    
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
    new Vue().$watch(
        () => SettingsDataModule.settings.extensionLanguageRegion,
        region => $i18n.localeRegion = region ?? null,
        { immediate: true }
    );
}

async function applyRouteSettings() {
    await SettingsDataModule.ready;

    const routeSettings = SettingsDataModule.settings.defaultRoutes;
    const allRoutes = router.getRoutes();

    Object.keys(routeSettings).forEach(routeName => {
        const route = allRoutes.find(route => route.name == routeName);
        const targetRouteName = routeSettings[routeName];
        const targetRoute = allRoutes.find(route => route.name == targetRouteName);
        if (route == null || targetRoute == null) {
            console.warn(`Route redirect could not resolved as at least one of the routes does not exist ('${routeName}' -> '${targetRouteName}')`);
            delete routeSettings[routeName];
            return;
        }

        route.redirect = { name: targetRouteName };
    });
    SettingsDataModule.updateSettings({
        ...SettingsDataModule.settings,
        defaultRoutes: routeSettings,
    });
}

function mountVue() {
    Vue.config.productionTip = false;

    const vue = new Vue({
        router,
        render: h => h(App)
    }).$mount('#app');
}

