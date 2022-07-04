import Vue from 'vue';
import App from './App.vue';

import './extend-vue';

import '@mdi/font/css/materialdesignicons.min.css';

import '@/views/_shared/styles/index.scss';
import '@/views/_shared/components/common';
import '@/views/_shared/components/ogame';

Vue.config.productionTip = false;
new Vue({
    render: h => h(App)
}).$mount('#app');