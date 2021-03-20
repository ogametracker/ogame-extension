import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

// bootstrap & boostrap-vue
import '@/styles/index.scss';
import { BootstrapVue } from 'bootstrap-vue';
Vue.use(BootstrapVue);

new Vue({
    router,
    render: h => h(App)
}).$mount('#ogame-tracker-dialog');
