import Vue from 'vue';
import App from './components/App.vue';
import router from './router';

// include icon as global component
import Icon from '@/components/common/Icon.vue';
Vue.component('icon', Icon);

// import custom styles
import '@/styles/index.scss';

// import materialdesignicons
import '@mdi/font/css/materialdesignicons.min.css';

Vue.config.productionTip = false;

// vue-i18n
import i18n from '@/i18n/vue-i18n';


new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#ogame-tracker-dialog');
