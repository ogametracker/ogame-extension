import viewsIndex from '@stats/views/Index.vue';
import viewsDonate from '@stats/views/Donate.vue';
import viewsExcelExport from '@stats/views/Excel-Export.vue';
import viewsInfo from '@stats/views/Info.vue';
import viewscombatsIndex from '@stats/views/combats/Index.vue';
import viewsdebrisfieldsIndex from '@stats/views/debris-fields/Index.vue';
import viewsempireIndex from '@stats/views/empire/Index.vue';
import viewsexpeditionsIndex from '@stats/views/expeditions/Index.vue';
import viewsexpeditionsdarkmatterIndex from '@stats/views/expeditions/dark-matter/Index.vue';
import viewsexpeditionsdarkmattercountIndex from '@stats/views/expeditions/dark-matter/count/Index.vue';
import viewsexpeditionsdarkmattercountChart from '@stats/views/expeditions/dark-matter/count/Chart.vue';
import viewsexpeditionsdarkmattercountTable from '@stats/views/expeditions/dark-matter/count/Table.vue';
import viewsexpeditionsdarkmattersizesIndex from '@stats/views/expeditions/dark-matter/sizes/Index.vue';
import viewsexpeditionsdarkmattersizesChart from '@stats/views/expeditions/dark-matter/sizes/Chart.vue';
import viewsexpeditionsdarkmattersizesTable from '@stats/views/expeditions/dark-matter/sizes/Table.vue';
import viewsexpeditionsdistributionChart from '@stats/views/expeditions/distribution/Chart.vue';
import viewsexpeditionsitemsChart from '@stats/views/expeditions/items/Chart.vue';
import viewsexpeditionsoverviewIndex from '@stats/views/expeditions/overview/Index.vue';
import viewsexpeditionsoverviewCharts from '@stats/views/expeditions/overview/Charts.vue';
import viewsexpeditionsoverviewTables from '@stats/views/expeditions/overview/Tables.vue';
import viewsexpeditionsresourcesIndex from '@stats/views/expeditions/resources/Index.vue';
import viewsexpeditionsresourcesCharts from '@stats/views/expeditions/resources/Charts.vue';
import viewsexpeditionsresourcesTables from '@stats/views/expeditions/resources/Tables.vue';
import viewsexpeditionsshipsIndex from '@stats/views/expeditions/ships/Index.vue';
import viewsexpeditionsshipscountChart from '@stats/views/expeditions/ships/count/Chart.vue';
import viewsexpeditionsshipscountTable from '@stats/views/expeditions/ships/count/Table.vue';
import viewsexpeditionsshipsresourcesChart from '@stats/views/expeditions/ships/resources/Chart.vue';
import viewsexpeditionsshipsresourcesTable from '@stats/views/expeditions/ships/resources/Table.vue';
import viewsexpeditionsshipssizesresourcesChart from '@stats/views/expeditions/ships/sizes/resources/Chart.vue';
import viewsexpeditionsshipssizesresourcesTable from '@stats/views/expeditions/ships/sizes/resources/Table.vue';
import viewsresourceoverviewIndex from '@stats/views/resource-overview/Index.vue';
import viewssettingsIndex from '@stats/views/settings/Index.vue';
import viewstoolsIndex from '@stats/views/tools/Index.vue';
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        path: "/",
        name: "",
        component: viewsIndex,
        children: [
            {
                path: "donate",
                name: "donate",
                meta: {
                    color: "#ffc800"
                },
                component: viewsDonate,
                children: []
            },
            {
                path: "excel-export",
                name: "excel-export",
                meta: {
                    color: "#21a366"
                },
                component: viewsExcelExport,
                children: []
            },
            {
                path: "info",
                name: "info",
                meta: {
                    color: "#8c8ce0"
                },
                component: viewsInfo,
                children: []
            },
            {
                path: "combats",
                name: "combats",
                meta: {
                    color: "#c51b00"
                },
                component: viewscombatsIndex,
                children: []
            },
            {
                path: "debris-fields",
                name: "debris-fields",
                meta: {
                    color: "#00a031"
                },
                component: viewsdebrisfieldsIndex,
                children: []
            },
            {
                path: "empire",
                name: "empire",
                meta: {
                    color: "#5000d0"
                },
                component: viewsempireIndex,
                children: []
            },
            {
                path: "expeditions",
                name: "expeditions",
                meta: {
                    color: "#0066ff"
                },
                component: viewsexpeditionsIndex,
                children: [
                    {
                        path: "dark-matter",
                        name: "expeditions/dark-matter",
                        component: viewsexpeditionsdarkmatterIndex,
                        children: [
                            {
                                path: "count",
                                name: "expeditions/dark-matter/count",
                                component: viewsexpeditionsdarkmattercountIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/dark-matter/count/chart",
                                        component: viewsexpeditionsdarkmattercountChart,
                                        children: []
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/dark-matter/count/table",
                                        component: viewsexpeditionsdarkmattercountTable,
                                        children: []
                                    }
                                ]
                            },
                            {
                                path: "sizes",
                                name: "expeditions/dark-matter/sizes",
                                component: viewsexpeditionsdarkmattersizesIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/dark-matter/sizes/chart",
                                        component: viewsexpeditionsdarkmattersizesChart,
                                        children: []
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/dark-matter/sizes/table",
                                        component: viewsexpeditionsdarkmattersizesTable,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: "distribution",
                        children: [
                            {
                                path: "chart",
                                name: "expeditions/distribution/chart",
                                component: viewsexpeditionsdistributionChart,
                                children: []
                            }
                        ]
                    },
                    {
                        path: "items",
                        children: [
                            {
                                path: "chart",
                                name: "expeditions/items/chart",
                                component: viewsexpeditionsitemsChart,
                                children: []
                            }
                        ]
                    },
                    {
                        path: "overview",
                        name: "expeditions/overview",
                        component: viewsexpeditionsoverviewIndex,
                        children: [
                            {
                                path: "charts",
                                name: "expeditions/overview/charts",
                                component: viewsexpeditionsoverviewCharts,
                                children: []
                            },
                            {
                                path: "tables",
                                name: "expeditions/overview/tables",
                                component: viewsexpeditionsoverviewTables,
                                children: []
                            }
                        ]
                    },
                    {
                        path: "resources",
                        name: "expeditions/resources",
                        component: viewsexpeditionsresourcesIndex,
                        children: [
                            {
                                path: "charts",
                                name: "expeditions/resources/charts",
                                component: viewsexpeditionsresourcesCharts,
                                children: []
                            },
                            {
                                path: "tables",
                                name: "expeditions/resources/tables",
                                component: viewsexpeditionsresourcesTables,
                                children: []
                            }
                        ]
                    },
                    {
                        path: "ships",
                        name: "expeditions/ships",
                        component: viewsexpeditionsshipsIndex,
                        children: [
                            {
                                path: "count",
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/ships/count/chart",
                                        component: viewsexpeditionsshipscountChart,
                                        children: []
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/ships/count/table",
                                        component: viewsexpeditionsshipscountTable,
                                        children: []
                                    }
                                ]
                            },
                            {
                                path: "resources",
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/ships/resources/chart",
                                        component: viewsexpeditionsshipsresourcesChart,
                                        children: []
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/ships/resources/table",
                                        component: viewsexpeditionsshipsresourcesTable,
                                        children: []
                                    }
                                ]
                            },
                            {
                                path: "sizes",
                                children: [
                                    {
                                        path: "resources",
                                        children: [
                                            {
                                                path: "chart",
                                                name: "expeditions/ships/sizes/resources/chart",
                                                component: viewsexpeditionsshipssizesresourcesChart,
                                                children: []
                                            },
                                            {
                                                path: "table",
                                                name: "expeditions/ships/sizes/resources/table",
                                                component: viewsexpeditionsshipssizesresourcesTable,
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                path: "resource-overview",
                name: "resource-overview",
                meta: {
                    color: "#a9460c"
                },
                component: viewsresourceoverviewIndex,
                children: []
            },
            {
                path: "settings",
                name: "settings",
                meta: {
                    color: "#888888"
                },
                component: viewssettingsIndex,
                children: []
            },
            {
                path: "tools",
                name: "tools",
                meta: {
                    color: "#008c85"
                },
                component: viewstoolsIndex,
                children: []
            }
        ]
    }
];
export default routes;