import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Expeditions from '../components/expeditions/Expeditions.vue';
import ExpeditionsOverview from '../components/expeditions/overview/Overview.vue';
import ExpeditionsOverviewCharts from '../components/expeditions/overview/Charts.vue';
import ExpeditionsOverviewTables from '../components/expeditions/overview/Tables.vue';

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
        redirect: { name: 'expeditions/overview' }, //TODO: user setting
        component: Expeditions,
        children: [
            {
                name: 'expeditions/overview',
                path: 'overview',
                redirect: { name: 'expeditions/overview/charts' }, //TODO: user setting 
                component: ExpeditionsOverview,
                children: [
                    {
                        name: 'expeditions/overview/charts',
                        path: 'charts',
                        component: ExpeditionsOverviewCharts,
                    },
                    {
                        name: 'expeditions/overview/tables',
                        path: 'tables',
                        component: ExpeditionsOverviewTables,
                    },
                ],
            },
            {
                name: 'expeditions/resources',
                path: 'resources',
                //component: null,
            },
            {
                name: 'expeditions/ships',
                path: 'ships',
                //component: null,
            },
            {
                name: 'expeditions/dark-matter',
                path: 'dark-matter',
                //component: null,
            },
            {
                name: 'expeditions/items',
                path: 'items',
                //component: null,
            },
            {
                name: 'expeditions/distribution',
                path: 'distribution',
                //component: null,
            },
        ],
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
