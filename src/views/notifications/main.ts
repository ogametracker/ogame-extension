import Vue from 'vue';
import App from './App.vue';

import './extend-vue';

import '@mdi/font/css/materialdesignicons.min.css';
import '@/styles/env.scss';
import '@/styles/reset.scss';
import './styles.scss';

import '../_shared/components/ogame';

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
