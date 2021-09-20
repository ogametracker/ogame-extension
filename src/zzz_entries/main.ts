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
    
    extensionI18n.locale = SettingsModule.settings.language;

    const ogameLang = getLanguage(null);
    ogameI18n.enabled = ogameLang != null;
    ogameI18n.locale = ogameLang ?? ogameI18n.locale;
}

async function initExtension() {
    const app = new App();

    attach(app);

    await mountDialog(app);
    await initLocales();
    await migrations();
    startTracking();
}

import MenuItem from '@/components/MenuItem.vue';
function attach(appComponent: App) {
    let ready = false;

    const observer = new MutationObserver(() => attachMenuItem());
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    function addMenuItem(menu: Element) {
        const dialogLink = document.createElement('li');
        menu.appendChild(dialogLink);

        const menuItem: any = new MenuItem();
        menuItem.app = appComponent;
        menuItem.$mount(dialogLink);
    }

    function attachMenuItem() {
        if (ready) {
            return;
        }

        const menu = document.querySelector('#menuTable');
        if (menu == null) {
            return;
        }

        addMenuItem(menu);
        ready = true;
        observer.disconnect();
    }
}

initExtension();