import Vue from 'vue';
import App from './components/App.vue';

// include icon as global component
import Icon from '@/components/common/Icon.vue';
Vue.component('icon', Icon);

// import custom styles
import '@/styles/index.scss';

// import materialdesignicons
import '@mdi/font/css/materialdesignicons.min.css';

Vue.config.productionTip = false;

// i18n
import i18n from '@/i18n/';

// tracking
import trackMessages from '@/tracking/trackMessages';



function mount () {
    new Vue({
        i18n,
        render: h => h(App),
    }).$mount('#ogame-tracker-dialog');
}

function start() {
    //TODO: add menu item + mount Vue on click
    mount();

    trackMessages();
}

start();