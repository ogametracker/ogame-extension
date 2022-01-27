import viewsIndex from '@stats/views/Index.vue';
import viewsDonate from '@stats/views/Donate.vue';
import viewsExcelExport from '@stats/views/Excel-Export.vue';
import viewsInfo from '@stats/views/Info.vue';
import viewscombatsIndex from '@stats/views/combats/Index.vue';
import viewsdebrisfieldsIndex from '@stats/views/debris-fields/Index.vue';
import viewsempireIndex from '@stats/views/empire/Index.vue';
import viewsexpeditionsIndex from '@stats/views/expeditions/Index.vue';
import viewsexpeditionsdarkmatterIndex from '@stats/views/expeditions/dark-matter/Index.vue';
import viewsexpeditionsdarkmatteramountIndex from '@stats/views/expeditions/dark-matter/amount/Index.vue';
import viewsexpeditionsdarkmatteramountChart from '@stats/views/expeditions/dark-matter/amount/Chart.vue';
import viewsexpeditionsdarkmatteramountTable from '@stats/views/expeditions/dark-matter/amount/Table.vue';
import viewsexpeditionsdarkmattersizesIndex from '@stats/views/expeditions/dark-matter/sizes/Index.vue';
import viewsexpeditionsdarkmattersizesChart from '@stats/views/expeditions/dark-matter/sizes/Chart.vue';
import viewsexpeditionsdarkmattersizesTable from '@stats/views/expeditions/dark-matter/sizes/Table.vue';
import viewsexpeditionsdistributionIndex from '@stats/views/expeditions/distribution/Index.vue';
import viewsexpeditionsdistributionChart from '@stats/views/expeditions/distribution/Chart.vue';
import viewsexpeditionsdistributionoldIndex from '@stats/views/expeditions/distribution/oldIndex.vue';
import viewsexpeditionsdistributionTable from '@stats/views/expeditions/distribution/Table.vue';
import viewsexpeditionsitemsIndex from '@stats/views/expeditions/items/Index.vue';
import viewsexpeditionsoverviewIndex from '@stats/views/expeditions/overview/Index.vue';
import viewsexpeditionsoverviewChart from '@stats/views/expeditions/overview/Chart.vue';
import viewsexpeditionsoverviewTable from '@stats/views/expeditions/overview/Table.vue';
import viewsexpeditionsresourcesIndex from '@stats/views/expeditions/resources/Index.vue';
import viewsexpeditionsresourcesamountIndex from '@stats/views/expeditions/resources/amount/Index.vue';
import viewsexpeditionsresourcesamountChart from '@stats/views/expeditions/resources/amount/Chart.vue';
import viewsexpeditionsresourcesamountTable from '@stats/views/expeditions/resources/amount/Table.vue';
import viewsexpeditionsresourcessizesIndex from '@stats/views/expeditions/resources/sizes/Index.vue';
import viewsexpeditionsresourcessizesChart from '@stats/views/expeditions/resources/sizes/Chart.vue';
import viewsexpeditionsresourcessizesTable from '@stats/views/expeditions/resources/sizes/Table.vue';
import viewsexpeditionsshipsIndex from '@stats/views/expeditions/ships/Index.vue';
import viewsexpeditionsshipsamountIndex from '@stats/views/expeditions/ships/amount/Index.vue';
import viewsexpeditionsshipsamountChart from '@stats/views/expeditions/ships/amount/Chart.vue';
import viewsexpeditionsshipsamountTable from '@stats/views/expeditions/ships/amount/Table.vue';
import viewsexpeditionsshipsresourcesIndex from '@stats/views/expeditions/ships/resources/Index.vue';
import viewsexpeditionsshipsresourcesChart from '@stats/views/expeditions/ships/resources/Chart.vue';
import viewsexpeditionsshipsresourcesTable from '@stats/views/expeditions/ships/resources/Table.vue';
import viewsexpeditionsshipssizesIndex from '@stats/views/expeditions/ships/sizes/Index.vue';
import viewsexpeditionsshipssizesChart from '@stats/views/expeditions/ships/sizes/Chart.vue';
import viewsexpeditionsshipssizesTable from '@stats/views/expeditions/ships/sizes/Table.vue';
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
                component: viewsDonate
            },
            {
                path: "excel-export",
                name: "excel-export",
                meta: {
                    color: "#21a366"
                },
                component: viewsExcelExport
            },
            {
                path: "info",
                name: "info",
                meta: {
                    color: "#8c8ce0"
                },
                component: viewsInfo
            },
            {
                path: "combats",
                name: "combats",
                meta: {
                    color: "#c51b00"
                },
                component: viewscombatsIndex
            },
            {
                path: "debris-fields",
                name: "debris-fields",
                meta: {
                    color: "#00a031"
                },
                component: viewsdebrisfieldsIndex
            },
            {
                path: "empire",
                name: "empire",
                meta: {
                    color: "#5000d0"
                },
                component: viewsempireIndex
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
                                path: "amount",
                                name: "expeditions/dark-matter/amount",
                                component: viewsexpeditionsdarkmatteramountIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/dark-matter/amount/chart",
                                        component: viewsexpeditionsdarkmatteramountChart
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/dark-matter/amount/table",
                                        component: viewsexpeditionsdarkmatteramountTable
                                    }
                                ],
                                redirect: {
                                    name: "expeditions/dark-matter/amount/chart"
                                }
                            },
                            {
                                path: "sizes",
                                name: "expeditions/dark-matter/sizes",
                                component: viewsexpeditionsdarkmattersizesIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/dark-matter/sizes/chart",
                                        component: viewsexpeditionsdarkmattersizesChart
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/dark-matter/sizes/table",
                                        component: viewsexpeditionsdarkmattersizesTable
                                    }
                                ],
                                redirect: {
                                    name: "expeditions/dark-matter/sizes/chart"
                                }
                            }
                        ],
                        redirect: {
                            name: "expeditions/dark-matter/amount"
                        }
                    },
                    {
                        path: "distribution",
                        name: "expeditions/distribution",
                        component: viewsexpeditionsdistributionIndex,
                        children: [
                            {
                                path: "chart",
                                name: "expeditions/distribution/chart",
                                component: viewsexpeditionsdistributionChart
                            },
                            {
                                path: "oldindex",
                                name: "expeditions/distribution/oldindex",
                                component: viewsexpeditionsdistributionoldIndex
                            },
                            {
                                path: "table",
                                name: "expeditions/distribution/table",
                                component: viewsexpeditionsdistributionTable
                            }
                        ],
                        redirect: {
                            name: "expeditions/distribution/chart"
                        }
                    },
                    {
                        path: "items",
                        name: "expeditions/items",
                        component: viewsexpeditionsitemsIndex
                    },
                    {
                        path: "overview",
                        name: "expeditions/overview",
                        component: viewsexpeditionsoverviewIndex,
                        children: [
                            {
                                path: "chart",
                                name: "expeditions/overview/chart",
                                component: viewsexpeditionsoverviewChart
                            },
                            {
                                path: "table",
                                name: "expeditions/overview/table",
                                component: viewsexpeditionsoverviewTable
                            }
                        ],
                        redirect: {
                            name: "expeditions/overview/chart"
                        }
                    },
                    {
                        path: "resources",
                        name: "expeditions/resources",
                        component: viewsexpeditionsresourcesIndex,
                        children: [
                            {
                                path: "amount",
                                name: "expeditions/resources/amount",
                                component: viewsexpeditionsresourcesamountIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/resources/amount/chart",
                                        component: viewsexpeditionsresourcesamountChart
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/resources/amount/table",
                                        component: viewsexpeditionsresourcesamountTable
                                    }
                                ],
                                redirect: {
                                    name: "expeditions/resources/amount/chart"
                                }
                            },
                            {
                                path: "sizes",
                                name: "expeditions/resources/sizes",
                                component: viewsexpeditionsresourcessizesIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/resources/sizes/chart",
                                        component: viewsexpeditionsresourcessizesChart
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/resources/sizes/table",
                                        component: viewsexpeditionsresourcessizesTable
                                    }
                                ],
                                redirect: {
                                    name: "expeditions/resources/sizes/chart"
                                }
                            }
                        ],
                        redirect: {
                            name: "expeditions/resources/amount"
                        }
                    },
                    {
                        path: "ships",
                        name: "expeditions/ships",
                        component: viewsexpeditionsshipsIndex,
                        children: [
                            {
                                path: "amount",
                                name: "expeditions/ships/amount",
                                component: viewsexpeditionsshipsamountIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/ships/amount/chart",
                                        component: viewsexpeditionsshipsamountChart
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/ships/amount/table",
                                        component: viewsexpeditionsshipsamountTable
                                    }
                                ],
                                redirect: {
                                    name: "expeditions/ships/amount/chart"
                                }
                            },
                            {
                                path: "resources",
                                name: "expeditions/ships/resources",
                                component: viewsexpeditionsshipsresourcesIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/ships/resources/chart",
                                        component: viewsexpeditionsshipsresourcesChart
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/ships/resources/table",
                                        component: viewsexpeditionsshipsresourcesTable
                                    }
                                ],
                                redirect: {
                                    name: "expeditions/ships/resources/chart"
                                }
                            },
                            {
                                path: "sizes",
                                name: "expeditions/ships/sizes",
                                component: viewsexpeditionsshipssizesIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/ships/sizes/chart",
                                        component: viewsexpeditionsshipssizesChart
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/ships/sizes/table",
                                        component: viewsexpeditionsshipssizesTable
                                    }
                                ],
                                redirect: {
                                    name: "expeditions/ships/sizes/chart"
                                }
                            }
                        ],
                        redirect: {
                            name: "expeditions/ships/amount"
                        }
                    }
                ],
                redirect: {
                    name: "expeditions/dark-matter"
                }
            },
            {
                path: "resource-overview",
                name: "resource-overview",
                meta: {
                    color: "#a9460c"
                },
                component: viewsresourceoverviewIndex
            },
            {
                path: "settings",
                name: "settings",
                meta: {
                    color: "#888888"
                },
                component: viewssettingsIndex
            },
            {
                path: "tools",
                name: "tools",
                meta: {
                    color: "#008c85"
                },
                component: viewstoolsIndex
            }
        ],
        redirect: {
            name: "donate"
        }
    }
];
export default routes;