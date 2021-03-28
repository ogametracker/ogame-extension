import Vue from 'vue';
import App from './components/App.vue';
import env from '@/env';

// include icon as global component
import Icon from '@/components/common/Icon.vue';
Vue.component('icon', Icon);

// import custom styles
import '@/styles/index.scss';

Vue.config.productionTip = false;

// i18n
import i18n from '@/i18n/';

// tracking
import trackMessages from '@/tracking/trackMessages';
import migration_v0_v1 from './migrations/migration_v0_v1';


function mountVue() {
    const app = document.createElement('div');
    app.id = 'ogame-tracker-dialog';
    document.body.appendChild(app);

    new Vue({
        i18n,
        render: h => h(App),
    }).$mount(`#${app.id}`);
}

async function migrations() {
    await migration_v0_v1();
}

async function initExtension() {
    mountVue();
    await migrations();
    trackMessages();
}


initExtension();