import Vue from 'vue';
import App from '@/components/App.vue';

// add $extBase to vue instances
const chromeUrl = chrome.extension.getURL('');
Vue.prototype.$extBase = chromeUrl.substr(0, chromeUrl.length - 1); // remove trailing slash

// add vue-debounce
import vueDebounce from 'vue-debounce';
Vue.use(vueDebounce, {
    listenTo: ['input', 'change', 'blur'],
    defaultTime: '150ms',
});

// include global components
import '@/components/common';

// import custom styles
import '@/styles/index.scss';

// i18n
import { ogameI18n, extensionI18n } from '@/i18n/';

// tracking
import { startTracking } from '@/tracking';

// migrations
import migrations from '@/migrations';

// register custom chart.js tooltip positioner
import '@/chartjs/Tooltip.positioners.top';

Vue.config.productionTip = false;

// prototype extensions/overrides
import '@/prototype-extensions/Math';
import getLanguage from '@/i18n/mapLanguage';
import SettingsModule from '@/store/modules/SettingsModule';
import attach from './attach';
import waitForDocumentLoad from '@/utils/waitForDocumentLoad';

async function mountDialog(appComponent: App) {
    await waitForDocumentLoad;

    const app = document.createElement('div');
    app.id = 'ogame-tracker-dialog';
    document.body.appendChild(app);

    appComponent.$mount(app);
}

async function initLocales() {
    await SettingsModule.createdPromise; //ensure Settings module loaded
    extensionI18n.locale = SettingsModule.settings.fallbackLanguage;
    const ogameLang = getLanguage(null);
    ogameI18n.enabled = ogameLang != null;
    ogameI18n.locale = ogameLang ?? ogameI18n.locale;
}

async function initExtension() {
    const app = new App({
        i18n: extensionI18n,
    });

    attach(app);

    await mountDialog(app);
    await initLocales();
    await migrations();
    startTracking();
}

initExtension();