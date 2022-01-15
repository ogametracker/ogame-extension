import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: { name: 'expeditions' },
    },
    {
        name: 'expeditions',
        path: '/expeditions',
        meta: {
            color: '#0066ff',
        },
    },
    {
        name: 'combats',
        path: '/combats',
        meta: {
            color: '#c51b00',
        },
    },
    {
        name: 'debris-fields',
        path: '/debris-fields',
        meta: {
            color: '#00a031',
        },
    },
    {
        name: 'resource-balance',
        path: '/resource-balance',
        meta: {
            color: '#a9460c',
        },
    },
    {
        name: 'empire',
        path: '/empire',
        meta: {
            color: '#5000d0',
        },
    },
    {
        name: 'tools',
        path: '/tools',
        meta: {
            color: '#008c85',
        },
    },
    {
        //TODO: remove
        name: 'settings',
        path: '/settings',
        meta: {
            color: '#888888',
        },
    },
    {
        name: 'excel-export',
        path: '/excel-export',
        meta: {
            color: '#21a366',
        },
    },
    {
        name: 'info',
        path: '/info',
        meta: {
            color: '#8c8ce0',
        },
    },
    {
        name: 'donate',
        path: '/donate',
        meta: {
            color: '#f50057',
        },
    },
];

const router = new VueRouter({
    routes,
});

export default router;
