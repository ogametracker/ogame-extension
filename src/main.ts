import Vue from 'vue';
import App from './components/App.vue';

// include icon as global component
import Icon from '@/components/common/Icon.vue';
Vue.component('icon', Icon);

// import custom styles
import '@/styles/index.scss';

Vue.config.productionTip = false;

import OgameMetaData from './models/ogame/OgameMetaData';

// i18n
import i18n from '@/i18n/';
i18n.locale = Object.values(LanguageKey).find(lang => lang == OgameMetaData.locale) ?? LanguageKey.de;

// tracking
import trackMessages from '@/tracking/trackMessages';

// migrations
import migrations from './migrations';

// register custom chart.js tooltip positioner
import '@/chartjs/Tooltip.positioners.top';
import LanguageKey from './i18n/languageKey';
import SettingsModule from './store/modules/SettingsModule';

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
    trackMessages();
}


initExtension();