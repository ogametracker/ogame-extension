import viewsIndex from '@stats/views/Index.vue';
import viewsDonate from '@stats/views/Donate.vue';
import viewsExcelExport from '@stats/views/Excel-Export.vue';
import viewsInfo from '@stats/views/Info.vue';
import viewscombatsIndex from '@stats/views/combats/Index.vue';
import viewscombatslostshipsIndex from '@stats/views/combats/lost-ships/Index.vue';
import viewscombatslostshipsagainstplayersIndex from '@stats/views/combats/lost-ships/against-players/Index.vue';
import viewscombatslostshipsagainstplayersChart from '@stats/views/combats/lost-ships/against-players/Chart.vue';
import viewscombatslostshipsagainstplayersTable from '@stats/views/combats/lost-ships/against-players/Table.vue';
import viewscombatslostshipsonexpeditionsIndex from '@stats/views/combats/lost-ships/on-expeditions/Index.vue';
import viewscombatslostshipsonexpeditionsChart from '@stats/views/combats/lost-ships/on-expeditions/Chart.vue';
import viewscombatslostshipsonexpeditionsTable from '@stats/views/combats/lost-ships/on-expeditions/Table.vue';
import viewscombatsoverviewIndex from '@stats/views/combats/overview/Index.vue';
import viewscombatsoverviewagainstplayersIndex from '@stats/views/combats/overview/against-players/Index.vue';
import viewscombatsoverviewagainstplayersChart from '@stats/views/combats/overview/against-players/Chart.vue';
import viewscombatsoverviewagainstplayersTable from '@stats/views/combats/overview/against-players/Table.vue';
import viewscombatsoverviewonexpeditionsIndex from '@stats/views/combats/overview/on-expeditions/Index.vue';
import viewscombatsoverviewonexpeditionsChart from '@stats/views/combats/overview/on-expeditions/Chart.vue';
import viewscombatsoverviewonexpeditionsTable from '@stats/views/combats/overview/on-expeditions/Table.vue';
import viewscombatsresourcesIndex from '@stats/views/combats/resources/Index.vue';
import viewscombatsresourcesChart from '@stats/views/combats/resources/Chart.vue';
import viewscombatsresourcesTable from '@stats/views/combats/resources/Table.vue';
import viewsdebrisfieldsIndex from '@stats/views/debris-fields/Index.vue';
import viewsdebrisfieldsChart from '@stats/views/debris-fields/Chart.vue';
import viewsdebrisfieldsTable from '@stats/views/debris-fields/Table.vue';
import viewsempireIndex from '@stats/views/empire/Index.vue';
import viewsempireAmortization from '@stats/views/empire/Amortization.vue';
import viewsempireproductionIndex from '@stats/views/empire/production/Index.vue';
import viewsempireproductionMines from '@stats/views/empire/production/Mines.vue';
import viewsempireproductionResources from '@stats/views/empire/production/Resources.vue';
import viewsexpeditionsIndex from '@stats/views/expeditions/Index.vue';
import viewsexpeditionsdarkmatterIndex from '@stats/views/expeditions/dark-matter/Index.vue';
import viewsexpeditionsdarkmatteramountIndex from '@stats/views/expeditions/dark-matter/amount/Index.vue';
import viewsexpeditionsdarkmatteramountChart from '@stats/views/expeditions/dark-matter/amount/Chart.vue';
import viewsexpeditionsdarkmatteramountTable from '@stats/views/expeditions/dark-matter/amount/Table.vue';
import viewsexpeditionsdarkmattersizesIndex from '@stats/views/expeditions/dark-matter/sizes/Index.vue';
import viewsexpeditionsdarkmattersizesChart from '@stats/views/expeditions/dark-matter/sizes/Chart.vue';
import viewsexpeditionsdarkmattersizesTable from '@stats/views/expeditions/dark-matter/sizes/Table.vue';
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
import viewspointsIndex from '@stats/views/points/Index.vue';
import viewsresourceoverviewIndex from '@stats/views/resource-overview/Index.vue';
import viewsresourceoverviewChart from '@stats/views/resource-overview/Chart.vue';
import viewsresourceoverviewTable from '@stats/views/resource-overview/Table.vue';
import viewssettingsIndex from '@stats/views/settings/Index.vue';
import viewstoolsIndex from '@stats/views/tools/Index.vue';
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        redirect: {
            name: "expeditions"
        },
        path: "/",
        name: "",
        component: viewsIndex,
        children: [
            {
                meta: {
                    color: "#ffc800"
                },
                path: "donate",
                name: "donate",
                component: viewsDonate
            },
            {
                meta: {
                    color: "#21a366"
                },
                path: "excel-export",
                name: "excel-export",
                component: viewsExcelExport
            },
            {
                meta: {
                    color: "#8c8ce0"
                },
                path: "info",
                name: "info",
                component: viewsInfo
            },
            {
                redirect: {
                    name: "combats/overview"
                },
                meta: {
                    color: "#c51b00"
                },
                path: "combats",
                name: "combats",
                component: viewscombatsIndex,
                children: [
                    {
                        redirect: {
                            name: "combats/lost-ships/against-players"
                        },
                        path: "lost-ships",
                        name: "combats/lost-ships",
                        component: viewscombatslostshipsIndex,
                        children: [
                            {
                                redirect: {
                                    name: "combats/lost-ships/against-players/chart"
                                },
                                path: "against-players",
                                name: "combats/lost-ships/against-players",
                                component: viewscombatslostshipsagainstplayersIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "combats/lost-ships/against-players/chart",
                                        component: viewscombatslostshipsagainstplayersChart
                                    },
                                    {
                                        path: "table",
                                        name: "combats/lost-ships/against-players/table",
                                        component: viewscombatslostshipsagainstplayersTable
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "combats/lost-ships/on-expeditions/chart"
                                },
                                path: "on-expeditions",
                                name: "combats/lost-ships/on-expeditions",
                                component: viewscombatslostshipsonexpeditionsIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "combats/lost-ships/on-expeditions/chart",
                                        component: viewscombatslostshipsonexpeditionsChart
                                    },
                                    {
                                        path: "table",
                                        name: "combats/lost-ships/on-expeditions/table",
                                        component: viewscombatslostshipsonexpeditionsTable
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        redirect: {
                            name: "combats/overview/against-players"
                        },
                        path: "overview",
                        name: "combats/overview",
                        component: viewscombatsoverviewIndex,
                        children: [
                            {
                                redirect: {
                                    name: "combats/overview/against-players/chart"
                                },
                                path: "against-players",
                                name: "combats/overview/against-players",
                                component: viewscombatsoverviewagainstplayersIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "combats/overview/against-players/chart",
                                        component: viewscombatsoverviewagainstplayersChart
                                    },
                                    {
                                        path: "table",
                                        name: "combats/overview/against-players/table",
                                        component: viewscombatsoverviewagainstplayersTable
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "combats/overview/on-expeditions/chart"
                                },
                                path: "on-expeditions",
                                name: "combats/overview/on-expeditions",
                                component: viewscombatsoverviewonexpeditionsIndex,
                                children: [
                                    {
                                        path: "chart",
                                        name: "combats/overview/on-expeditions/chart",
                                        component: viewscombatsoverviewonexpeditionsChart
                                    },
                                    {
                                        path: "table",
                                        name: "combats/overview/on-expeditions/table",
                                        component: viewscombatsoverviewonexpeditionsTable
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        redirect: {
                            name: "combats/resources/chart"
                        },
                        path: "resources",
                        name: "combats/resources",
                        component: viewscombatsresourcesIndex,
                        children: [
                            {
                                path: "chart",
                                name: "combats/resources/chart",
                                component: viewscombatsresourcesChart
                            },
                            {
                                path: "table",
                                name: "combats/resources/table",
                                component: viewscombatsresourcesTable
                            }
                        ]
                    }
                ]
            },
            {
                meta: {
                    color: "#00a031"
                },
                redirect: {
                    name: "debris-fields/table"
                },
                path: "debris-fields",
                name: "debris-fields",
                component: viewsdebrisfieldsIndex,
                children: [
                    {
                        path: "chart",
                        name: "debris-fields/chart",
                        component: viewsdebrisfieldsChart
                    },
                    {
                        path: "table",
                        name: "debris-fields/table",
                        component: viewsdebrisfieldsTable
                    }
                ]
            },
            {
                redirect: {
                    name: "empire/production"
                },
                meta: {
                    color: "#5000d0"
                },
                path: "empire",
                name: "empire",
                component: viewsempireIndex,
                children: [
                    {
                        path: "amortization",
                        name: "empire/amortization",
                        component: viewsempireAmortization
                    },
                    {
                        redirect: {
                            name: "empire/production/resources"
                        },
                        path: "production",
                        name: "empire/production",
                        component: viewsempireproductionIndex,
                        children: [
                            {
                                path: "mines",
                                name: "empire/production/mines",
                                component: viewsempireproductionMines
                            },
                            {
                                path: "resources",
                                name: "empire/production/resources",
                                component: viewsempireproductionResources
                            }
                        ]
                    }
                ]
            },
            {
                meta: {
                    color: "#0066ff"
                },
                redirect: {
                    name: "expeditions/overview"
                },
                path: "expeditions",
                name: "expeditions",
                component: viewsexpeditionsIndex,
                children: [
                    {
                        redirect: {
                            name: "expeditions/dark-matter/amount"
                        },
                        path: "dark-matter",
                        name: "expeditions/dark-matter",
                        component: viewsexpeditionsdarkmatterIndex,
                        children: [
                            {
                                redirect: {
                                    name: "expeditions/dark-matter/amount/chart"
                                },
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
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/dark-matter/sizes/chart"
                                },
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
                                ]
                            }
                        ]
                    },
                    {
                        path: "items",
                        name: "expeditions/items",
                        component: viewsexpeditionsitemsIndex
                    },
                    {
                        redirect: {
                            name: "expeditions/overview/chart"
                        },
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
                        ]
                    },
                    {
                        redirect: {
                            name: "expeditions/resources/amount"
                        },
                        path: "resources",
                        name: "expeditions/resources",
                        component: viewsexpeditionsresourcesIndex,
                        children: [
                            {
                                redirect: {
                                    name: "expeditions/resources/amount/chart"
                                },
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
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/resources/sizes/chart"
                                },
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
                                ]
                            }
                        ]
                    },
                    {
                        redirect: {
                            name: "expeditions/ships/amount"
                        },
                        path: "ships",
                        name: "expeditions/ships",
                        component: viewsexpeditionsshipsIndex,
                        children: [
                            {
                                redirect: {
                                    name: "expeditions/ships/amount/chart"
                                },
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
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/ships/resources/chart"
                                },
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
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/ships/sizes/chart"
                                },
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
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                meta: {
                    color: "#8b0436"
                },
                path: "points",
                name: "points",
                component: viewspointsIndex
            },
            {
                redirect: {
                    name: "resource-overview/chart"
                },
                meta: {
                    color: "#a9460c"
                },
                path: "resource-overview",
                name: "resource-overview",
                component: viewsresourceoverviewIndex,
                children: [
                    {
                        path: "chart",
                        name: "resource-overview/chart",
                        component: viewsresourceoverviewChart
                    },
                    {
                        path: "table",
                        name: "resource-overview/table",
                        component: viewsresourceoverviewTable
                    }
                ]
            },
            {
                meta: {
                    color: "#888888"
                },
                path: "settings",
                name: "settings",
                component: viewssettingsIndex
            },
            {
                meta: {
                    color: "#008c85"
                },
                path: "tools",
                name: "tools",
                component: viewstoolsIndex
            }
        ]
    }
];
export default routes;