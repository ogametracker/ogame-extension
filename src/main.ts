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



function mountVue() {
    const app = document.createElement('div');
    app.id = 'ogame-tracker-dialog';
    document.body.appendChild(app);

    new Vue({
        i18n,
        render: h => h(App),
    }).$mount(`#${app.id}`);
}

function addMenuItem() {
    const menu = document.querySelector('#menuTable')!;

    const dialogLink = document.createElement('li');
    dialogLink.innerHTML = `
        <span class="menu_icon">
            <span class="expo-stats-icon"></span>
        </span>
        <a class="menubutton" href="#">
            <span class="textlabel">Expeditions-Stats</span>
        </a>
    `;
    dialogLink.querySelector('a')!.addEventListener('click', () => {
        (window as any).ogameTracker.visible = true;
    });

    menu.appendChild(dialogLink);
}

if (env.isProduction) {
    addMenuItem();
}
mountVue();
trackMessages();