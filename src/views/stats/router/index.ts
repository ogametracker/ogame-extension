import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

// expeditions
import Expeditions from '@stats/views/expeditions/Index.vue';
// expeditions/overview
import ExpeditionsOverview from '@stats/views/expeditions/overview/Index.vue';
import ExpeditionsOverviewCharts from '@stats/views/expeditions/overview/Charts.vue';
import ExpeditionsOverviewTables from '@stats/views/expeditions/overview/Tables.vue';
// expeditions/resources
import ExpeditionsResources from '@stats/views/expeditions/resources/Index.vue';
import ExpeditionsResourcesCharts from '@stats/views/expeditions/resources/Charts.vue';
import ExpeditionsResourcesTables from '@stats/views/expeditions/resources/Tables.vue';
// expeditions/ships
import ExpeditionsShips from '@stats/views/expeditions/ships/Index.vue';
import ExpeditionsShipsCharts from '@stats/views/expeditions/ships/Charts.vue';
import ExpeditionsShipsTables from '@stats/views/expeditions/ships/Tables.vue';
// expeditions/dark-matter
import ExpeditionsDarkMatter from '@stats/views/expeditions/dark-matter/Index.vue';
import ExpeditionsDarkMatterCharts from '@stats/views/expeditions/dark-matter/Charts.vue';
import ExpeditionsDarkMatterTables from '@stats/views/expeditions/dark-matter/Tables.vue';
// expeditions/items
import ExpeditionsItemsChart from '@stats/views/expeditions/items/Chart.vue';
// expeditions/distribution
import ExpeditionsDistributionChart from '@stats/views/expeditions/distribution/Chart.vue';

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
                redirect: { name: 'expeditions/overview/chart' }, //TODO: user setting 
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
                redirect: { name: 'expeditions/resources/charts' }, //TODO: user setting 
                component: ExpeditionsResources,
                children: [
                    {
                        name: 'expeditions/resources/charts',
                        path: 'charts',
                        component: ExpeditionsResourcesCharts,
                    },
                    {
                        name: 'expeditions/resources/tables',
                        path: 'tables',
                        component: ExpeditionsResourcesTables,
                    },
                ],
            },
            {
                name: 'expeditions/ships',
                path: 'ships',
                redirect: { name: 'expeditions/ships/charts' }, //TODO: user setting 
                component: ExpeditionsShips,
                children: [
                    {
                        name: 'expeditions/ships/charts',
                        path: 'charts',
                        component: ExpeditionsShipsCharts,
                    },
                    {
                        name: 'expeditions/ships/tables',
                        path: 'tables',
                        component: ExpeditionsShipsTables,
                    },
                ],
            },
            {
                name: 'expeditions/dark-matter',
                path: 'dark-matter',
                redirect: { name: 'expeditions/dark-matter/charts' }, //TODO: user setting 
                component: ExpeditionsDarkMatter,
                children: [
                    {
                        name: 'expeditions/dark-matter/charts',
                        path: 'charts',
                        component: ExpeditionsDarkMatterCharts,
                    },
                    {
                        name: 'expeditions/dark-matter/tables',
                        path: 'tables',
                        component: ExpeditionsDarkMatterTables,
                    },
                ],
            },
            {
                name: 'expeditions/items',
                path: 'items',
                component: ExpeditionsItemsChart,
            },
            {
                name: 'expeditions/distribution',
                path: 'distribution',
                component: ExpeditionsDistributionChart,
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
            color: '#ffc800',
        },
    },
];

const router = new VueRouter({
    routes,
});

export default router;
