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
extensionI18n.locale = ogameI18n.locale = getLanguage();

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

function mountVue() {
    const app = document.createElement('div');
    app.id = 'ogame-tracker-dialog';
    document.body.appendChild(app);

    new Vue({
        i18n: extensionI18n,
        render: h => h(App),
    }).$mount(`#${app.id}`);
}

async function initExtension() {
    mountVue();

    await migrations();
    startTracking();
}

initExtension();