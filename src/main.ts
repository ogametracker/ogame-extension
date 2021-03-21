import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

// bootstrap & boostrap-vue
import '@/styles/index.scss';
import { BootstrapVue } from 'bootstrap-vue';
Vue.use(BootstrapVue);

// vue-i18n
import i18n from '@/i18n/vue-i18n';

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#ogame-tracker-dialog');
