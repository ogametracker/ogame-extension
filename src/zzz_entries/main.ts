import Vue from 'vue';
import App from '@/components/App.vue';

const chromeUrl = chrome.extension.getURL('');
Vue.prototype.$extBase = chromeUrl.substr(0, chromeUrl.length - 1); // remove trailing slash

// include global components
import '@/components/common';

// import custom styles
import '@/styles/index.scss';

Vue.config.productionTip = false;

import OgameMetaData from '@/models/ogame/OgameMetaData';

// i18n
import i18n from '@/i18n/';
i18n.locale = Object.values(LanguageKey).find(lang => lang == OgameMetaData.locale) ?? LanguageKey.de;

// tracking
import { startTracking } from '@/tracking';

// migrations
import migrations from '@/migrations';

// register custom chart.js tooltip positioner
import '@/chartjs/Tooltip.positioners.top';
import LanguageKey from '@/i18n/languageKey';

function mountVue() {
    const app = document.createElement('div');
    app.id = 'ogame-tracker-dialog';
    document.body.appendChild(app);

    new Vue({
        i18n,
        render: h => h(App),
    }).$mount(`#${app.id}`);
}

async function initExtension() {
    mountVue();

    await migrations();
    startTracking();
}


initExtension();