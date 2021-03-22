import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@/styles/index.scss';

Vue.config.productionTip = false;

// vue-i18n
import i18n from '@/i18n/vue-i18n';

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#ogame-tracker-dialog');
