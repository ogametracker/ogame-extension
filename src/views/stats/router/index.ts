import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes.generated';

Vue.use(VueRouter);

export const router = new VueRouter({
    routes
});
