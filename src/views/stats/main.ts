import '@mdi/font/css/materialdesignicons.min.css';
import './styles/styles.scss';

import './components/common';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './i18n/Localization-vue.ts';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');