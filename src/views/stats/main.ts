import '@mdi/font/css/materialdesignicons.min.css';
import './styles/styles.scss';

import './components/common';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './i18n/Localization-vue.ts';

Vue.config.productionTip = false;
Vue.config.warnHandler = (msg, vm, info) => console.warn(msg, { vm, info });
Vue.config.errorHandler = (error, vm, info) => console.error(error, { vm, info });

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');


window.addEventListener('message', e => {
    if(e.data == 'focus') {
        window.focus();
    }
});