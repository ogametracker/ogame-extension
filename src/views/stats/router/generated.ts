import viewsIndex from '@stats/views/Index.vue';
import viewsexpeditionsIndex from '@stats/views/expeditions/Index.vue';
import viewsexpeditionsdarkmatterIndex from '@stats/views/expeditions/dark-matter/Index.vue';
import viewsexpeditionsdarkmatterTables from '@stats/views/expeditions/dark-matter/Tables.vue';
import viewsexpeditionsdistributionChart from '@stats/views/expeditions/distribution/Chart.vue';
import viewsexpeditionsitemsChart from '@stats/views/expeditions/items/Chart.vue';
import viewsexpeditionsoverviewIndex from '@stats/views/expeditions/overview/Index.vue';
import viewsexpeditionsoverviewTables from '@stats/views/expeditions/overview/Tables.vue';
import viewsexpeditionsresourcesIndex from '@stats/views/expeditions/resources/Index.vue';
import viewsexpeditionsresourcesTables from '@stats/views/expeditions/resources/Tables.vue';
import viewsexpeditionsshipsIndex from '@stats/views/expeditions/ships/Index.vue';
import viewsexpeditionsshipscountChart from '@stats/views/expeditions/ships/count/Chart.vue';
import viewsexpeditionsshipscountTable from '@stats/views/expeditions/ships/count/Table.vue';
import viewsexpeditionsshipsresourcesChart from '@stats/views/expeditions/ships/resources/Chart.vue';
import viewsexpeditionsshipsresourcesTable from '@stats/views/expeditions/ships/resources/Table.vue';
import viewsexpeditionsshipssizesresourcesChart from '@stats/views/expeditions/ships/sizes/resources/Chart.vue';
import viewsexpeditionsshipssizesresourcesTable from '@stats/views/expeditions/ships/sizes/resources/Table.vue';

export default [
    {
        "path": "/",
        "meta": null,
        "name": "",
        component: viewsIndex,
        "children": [
            {
                "path": "expeditions",
                "meta": {
                    "color": "#0066ff"
                },
                "name": "expeditions",
                component: viewsexpeditionsIndex,
                "children": [
                    {
                        "path": "dark-matter",
                        "meta": null,
                        "name": "expeditions/dark-matter",
                        component: viewsexpeditionsdarkmatterIndex,
                        "children": [
                            {
                                "path": "tables",
                                "meta": null,
                                "name": "expeditions/dark-matter/tables",
                                component: viewsexpeditionsdarkmatterTables,
                                "children": []
                            }
                        ]
                    },
                    {
                        "path": "distribution",
                        "children": [
                            {
                                "path": "chart",
                                "meta": null,
                                "name": "expeditions/distribution/chart",
                                component: viewsexpeditionsdistributionChart,
                                "children": []
                            }
                        ]
                    },
                    {
                        "path": "items",
                        "children": [
                            {
                                "path": "chart",
                                "meta": null,
                                "name": "expeditions/items/chart",
                                component: viewsexpeditionsitemsChart,
                                "children": []
                            }
                        ]
                    },
                    {
                        "path": "overview",
                        "meta": null,
                        "name": "expeditions/overview",
                        component: viewsexpeditionsoverviewIndex,
                        "children": [
                            {
                                "path": "tables",
                                "meta": null,
                                "name": "expeditions/overview/tables",
                                component: viewsexpeditionsoverviewTables,
                                "children": []
                            }
                        ]
                    },
                    {
                        "path": "resources",
                        "meta": null,
                        "name": "expeditions/resources",
                        component: viewsexpeditionsresourcesIndex,
                        "children": [
                            {
                                "path": "tables",
                                "meta": null,
                                "name": "expeditions/resources/tables",
                                component: viewsexpeditionsresourcesTables,
                                "children": []
                            }
                        ]
                    },
                    {
                        "path": "ships",
                        "meta": null,
                        "name": "expeditions/ships",
                        component: viewsexpeditionsshipsIndex,
                        "children": [
                            {
                                "path": "count",
                                "children": [
                                    {
                                        "path": "chart",
                                        "meta": null,
                                        "name": "expeditions/ships/count/chart",
                                        component: viewsexpeditionsshipscountChart,
                                        "children": []
                                    },
                                    {
                                        "path": "table",
                                        "meta": null,
                                        "name": "expeditions/ships/count/table",
                                        component: viewsexpeditionsshipscountTable,
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "path": "resources",
                                "children": [
                                    {
                                        "path": "chart",
                                        "meta": null,
                                        "name": "expeditions/ships/resources/chart",
                                        component: viewsexpeditionsshipsresourcesChart,
                                        "children": []
                                    },
                                    {
                                        "path": "table",
                                        "meta": null,
                                        "name": "expeditions/ships/resources/table",
                                        component: viewsexpeditionsshipsresourcesTable,
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "path": "sizes",
                                "children": [
                                    {
                                        "path": "resources",
                                        "children": [
                                            {
                                                "path": "chart",
                                                "meta": null,
                                                "name": "expeditions/ships/sizes/resources/chart",
                                                component: viewsexpeditionsshipssizesresourcesChart,
                                                "children": []
                                            },
                                            {
                                                "path": "table",
                                                "meta": null,
                                                "name": "expeditions/ships/sizes/resources/table",
                                                component: viewsexpeditionsshipssizesresourcesTable,
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];