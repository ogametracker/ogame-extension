import viewsIndex from '@stats/views/Index.vue';
import viewsDonate from '@stats/views/Donate.vue';
import viewsExcelExport from '@stats/views/Excel-Export.vue';
import viewsaboutIndex from '@stats/views/about/Index.vue';
import viewsaboutHelp from '@stats/views/about/Help.vue';
import viewsaboutInfo from '@stats/views/about/Info.vue';
import viewscombatsIndex from '@stats/views/combats/Index.vue';
import viewscombatslostshipsIndex from '@stats/views/combats/lost-ships/Index.vue';
import viewscombatslostshipsagainstplayersIndex from '@stats/views/combats/lost-ships/against-players/Index.vue';
import viewscombatslostshipsagainstplayersamountIndex from '@stats/views/combats/lost-ships/against-players/amount/Index.vue';
import viewscombatslostshipsagainstplayersamountChart from '@stats/views/combats/lost-ships/against-players/amount/Chart.vue';
import viewscombatslostshipsagainstplayersamountTable from '@stats/views/combats/lost-ships/against-players/amount/Table.vue';
import viewscombatslostshipsagainstplayersresourcesIndex from '@stats/views/combats/lost-ships/against-players/resources/Index.vue';
import viewscombatslostshipsagainstplayersresourcesChart from '@stats/views/combats/lost-ships/against-players/resources/Chart.vue';
import viewscombatslostshipsagainstplayersresourcesTable from '@stats/views/combats/lost-ships/against-players/resources/Table.vue';
import viewscombatslostshipsonexpeditionsIndex from '@stats/views/combats/lost-ships/on-expeditions/Index.vue';
import viewscombatslostshipsonexpeditionsamountIndex from '@stats/views/combats/lost-ships/on-expeditions/amount/Index.vue';
import viewscombatslostshipsonexpeditionsamountChart from '@stats/views/combats/lost-ships/on-expeditions/amount/Chart.vue';
import viewscombatslostshipsonexpeditionsamountTable from '@stats/views/combats/lost-ships/on-expeditions/amount/Table.vue';
import viewscombatslostshipsonexpeditionsresourcesIndex from '@stats/views/combats/lost-ships/on-expeditions/resources/Index.vue';
import viewscombatslostshipsonexpeditionsresourcesChart from '@stats/views/combats/lost-ships/on-expeditions/resources/Chart.vue';
import viewscombatslostshipsonexpeditionsresourcesTable from '@stats/views/combats/lost-ships/on-expeditions/resources/Table.vue';
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
import viewsempirelifeformsIndex from '@stats/views/empire/lifeforms/Index.vue';
import viewsempirelifeformsOverview from '@stats/views/empire/lifeforms/Overview.vue';
import viewsempirelifeformsProgress from '@stats/views/empire/lifeforms/Progress.vue';
import viewsempirelifeformsdiscoveriesIndex from '@stats/views/empire/lifeforms/discoveries/Index.vue';
import viewsempirelifeformsdiscoveriesexperienceIndex from '@stats/views/empire/lifeforms/discoveries/experience/Index.vue';
import viewsempirelifeformsdiscoveriesexperienceChart from '@stats/views/empire/lifeforms/discoveries/experience/Chart.vue';
import viewsempirelifeformsdiscoveriesexperienceTable from '@stats/views/empire/lifeforms/discoveries/experience/Table.vue';
import viewsempirelifeformsdiscoveriesoverviewIndex from '@stats/views/empire/lifeforms/discoveries/overview/Index.vue';
import viewsempirelifeformsdiscoveriesoverviewChart from '@stats/views/empire/lifeforms/discoveries/overview/Chart.vue';
import viewsempirelifeformsdiscoveriesoverviewTable from '@stats/views/empire/lifeforms/discoveries/overview/Table.vue';
import viewsempireproductionIndex from '@stats/views/empire/production/Index.vue';
import viewsempireproductionMines from '@stats/views/empire/production/Mines.vue';
import viewsempireproductionResources from '@stats/views/empire/production/Resources.vue';
import viewsespionageIndex from '@stats/views/espionage/Index.vue';
import viewsexpeditionsIndex from '@stats/views/expeditions/Index.vue';
import viewsexpeditionsdarkmatterIndex from '@stats/views/expeditions/dark-matter/Index.vue';
import viewsexpeditionsdarkmatteramountIndex from '@stats/views/expeditions/dark-matter/amount/Index.vue';
import viewsexpeditionsdarkmatteramountChart from '@stats/views/expeditions/dark-matter/amount/Chart.vue';
import viewsexpeditionsdarkmatteramountTable from '@stats/views/expeditions/dark-matter/amount/Table.vue';
import viewsexpeditionsdarkmattersizesIndex from '@stats/views/expeditions/dark-matter/sizes/Index.vue';
import viewsexpeditionsdarkmattersizesChart from '@stats/views/expeditions/dark-matter/sizes/Chart.vue';
import viewsexpeditionsdarkmattersizesTable from '@stats/views/expeditions/dark-matter/sizes/Table.vue';
import viewsexpeditionsdepletionIndex from '@stats/views/expeditions/depletion/Index.vue';
import viewsexpeditionsdepletionChart from '@stats/views/expeditions/depletion/Chart.vue';
import viewsexpeditionsdepletionTable from '@stats/views/expeditions/depletion/Table.vue';
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
import viewsresourcebalanceIndex from '@stats/views/resource-balance/Index.vue';
import viewsresourcebalanceChart from '@stats/views/resource-balance/Chart.vue';
import viewsresourcebalanceTable from '@stats/views/resource-balance/Table.vue';
import viewssettingsIndex from '@stats/views/settings/Index.vue';
import viewssettingsAccessibility from '@stats/views/settings/Accessibility.vue';
import viewssettingsColors from '@stats/views/settings/Colors.vue';
import viewssettingsCombats from '@stats/views/settings/Combats.vue';
import viewssettingsCommon from '@stats/views/settings/Common.vue';
import viewssettingsDangerZone from '@stats/views/settings/Danger-Zone.vue';
import viewssettingsDateRanges from '@stats/views/settings/Date-Ranges.vue';
import viewssettingsDebrisFields from '@stats/views/settings/Debris-Fields.vue';
import viewssettingsExpeditions from '@stats/views/settings/Expeditions.vue';
import viewssettingsImportExport from '@stats/views/settings/Import-Export.vue';
import viewssettingsResourceBalance from '@stats/views/settings/Resource-Balance.vue';
import viewssettingsUniverseHistory from '@stats/views/settings/Universe-History.vue';
import viewstoolsIndex from '@stats/views/tools/Index.vue';
import viewstoolsConstructionQueue from '@stats/views/tools/Construction-Queue.vue';
import viewstoolsCostCalculator from '@stats/views/tools/Cost-Calculator.vue';
import viewstoolsExpeditionCalculator from '@stats/views/tools/Expedition-Calculator.vue';
import viewstoolsProductionCalculator from '@stats/views/tools/Production-Calculator.vue';
import viewstoolsResourceConversion from '@stats/views/tools/Resource-Conversion.vue';
import viewstoolsSignatureGenerator from '@stats/views/tools/Signature-Generator.vue';
import viewsuniversehistoryIndex from '@stats/views/universe-history/Index.vue';
import viewsuniversehistoryalliancesIndex from '@stats/views/universe-history/alliances/Index.vue';
import viewsuniversehistoryalliancesHighscore from '@stats/views/universe-history/alliances/Highscore.vue';
import viewsuniversehistoryalliancesHistory from '@stats/views/universe-history/alliances/History.vue';
import viewsuniversehistoryplayersIndex from '@stats/views/universe-history/players/Index.vue';
import viewsuniversehistoryplayersHighscore from '@stats/views/universe-history/players/Highscore.vue';
import viewsuniversehistoryplayersHistory from '@stats/views/universe-history/players/History.vue';
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
                    color: "#ffca00"
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
                redirect: {
                    name: "about/info"
                },
                meta: {
                    color: "#8c8ce0"
                },
                path: "about",
                name: "about",
                component: viewsaboutIndex,
                children: [
                    {
                        path: "help",
                        name: "about/help",
                        component: viewsaboutHelp
                    },
                    {
                        path: "info",
                        name: "about/info",
                        component: viewsaboutInfo
                    }
                ]
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
                                    name: "combats/lost-ships/against-players/amount"
                                },
                                path: "against-players",
                                name: "combats/lost-ships/against-players",
                                component: viewscombatslostshipsagainstplayersIndex,
                                children: [
                                    {
                                        redirect: {
                                            name: "combats/lost-ships/against-players/amount/chart"
                                        },
                                        path: "amount",
                                        name: "combats/lost-ships/against-players/amount",
                                        component: viewscombatslostshipsagainstplayersamountIndex,
                                        children: [
                                            {
                                                path: "chart",
                                                name: "combats/lost-ships/against-players/amount/chart",
                                                component: viewscombatslostshipsagainstplayersamountChart
                                            },
                                            {
                                                path: "table",
                                                name: "combats/lost-ships/against-players/amount/table",
                                                component: viewscombatslostshipsagainstplayersamountTable
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "combats/lost-ships/against-players/resources/chart"
                                        },
                                        path: "resources",
                                        name: "combats/lost-ships/against-players/resources",
                                        component: viewscombatslostshipsagainstplayersresourcesIndex,
                                        children: [
                                            {
                                                path: "chart",
                                                name: "combats/lost-ships/against-players/resources/chart",
                                                component: viewscombatslostshipsagainstplayersresourcesChart
                                            },
                                            {
                                                path: "table",
                                                name: "combats/lost-ships/against-players/resources/table",
                                                component: viewscombatslostshipsagainstplayersresourcesTable
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "combats/lost-ships/on-expeditions/amount"
                                },
                                path: "on-expeditions",
                                name: "combats/lost-ships/on-expeditions",
                                component: viewscombatslostshipsonexpeditionsIndex,
                                children: [
                                    {
                                        redirect: {
                                            name: "combats/lost-ships/on-expeditions/amount/chart"
                                        },
                                        path: "amount",
                                        name: "combats/lost-ships/on-expeditions/amount",
                                        component: viewscombatslostshipsonexpeditionsamountIndex,
                                        children: [
                                            {
                                                path: "chart",
                                                name: "combats/lost-ships/on-expeditions/amount/chart",
                                                component: viewscombatslostshipsonexpeditionsamountChart
                                            },
                                            {
                                                path: "table",
                                                name: "combats/lost-ships/on-expeditions/amount/table",
                                                component: viewscombatslostshipsonexpeditionsamountTable
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "combats/lost-ships/on-expeditions/resources/chart"
                                        },
                                        path: "resources",
                                        name: "combats/lost-ships/on-expeditions/resources",
                                        component: viewscombatslostshipsonexpeditionsresourcesIndex,
                                        children: [
                                            {
                                                path: "chart",
                                                name: "combats/lost-ships/on-expeditions/resources/chart",
                                                component: viewscombatslostshipsonexpeditionsresourcesChart
                                            },
                                            {
                                                path: "table",
                                                name: "combats/lost-ships/on-expeditions/resources/table",
                                                component: viewscombatslostshipsonexpeditionsresourcesTable
                                            }
                                        ]
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
                            name: "empire/lifeforms/overview"
                        },
                        path: "lifeforms",
                        name: "empire/lifeforms",
                        component: viewsempirelifeformsIndex,
                        children: [
                            {
                                path: "overview",
                                name: "empire/lifeforms/overview",
                                component: viewsempirelifeformsOverview
                            },
                            {
                                path: "progress",
                                name: "empire/lifeforms/progress",
                                component: viewsempirelifeformsProgress
                            },
                            {
                                redirect: {
                                    name: "empire/lifeforms/discoveries/overview"
                                },
                                path: "discoveries",
                                name: "empire/lifeforms/discoveries",
                                component: viewsempirelifeformsdiscoveriesIndex,
                                children: [
                                    {
                                        redirect: {
                                            name: "empire/lifeforms/discoveries/experience/chart"
                                        },
                                        path: "experience",
                                        name: "empire/lifeforms/discoveries/experience",
                                        component: viewsempirelifeformsdiscoveriesexperienceIndex,
                                        children: [
                                            {
                                                path: "chart",
                                                name: "empire/lifeforms/discoveries/experience/chart",
                                                component: viewsempirelifeformsdiscoveriesexperienceChart
                                            },
                                            {
                                                path: "table",
                                                name: "empire/lifeforms/discoveries/experience/table",
                                                component: viewsempirelifeformsdiscoveriesexperienceTable
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "empire/lifeforms/discoveries/overview/chart"
                                        },
                                        path: "overview",
                                        name: "empire/lifeforms/discoveries/overview",
                                        component: viewsempirelifeformsdiscoveriesoverviewIndex,
                                        children: [
                                            {
                                                path: "chart",
                                                name: "empire/lifeforms/discoveries/overview/chart",
                                                component: viewsempirelifeformsdiscoveriesoverviewChart
                                            },
                                            {
                                                path: "table",
                                                name: "empire/lifeforms/discoveries/overview/table",
                                                component: viewsempirelifeformsdiscoveriesoverviewTable
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
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
                    color: "#cb9913"
                },
                path: "espionage",
                name: "espionage",
                component: viewsespionageIndex
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
                        redirect: {
                            name: "expeditions/depletion/chart"
                        },
                        path: "depletion",
                        name: "expeditions/depletion",
                        component: viewsexpeditionsdepletionIndex,
                        children: [
                            {
                                path: "chart",
                                name: "expeditions/depletion/chart",
                                component: viewsexpeditionsdepletionChart
                            },
                            {
                                path: "table",
                                name: "expeditions/depletion/table",
                                component: viewsexpeditionsdepletionTable
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
                redirect: {
                    name: "resource-balance/chart"
                },
                meta: {
                    color: "#a9460c"
                },
                path: "resource-balance",
                name: "resource-balance",
                component: viewsresourcebalanceIndex,
                children: [
                    {
                        path: "chart",
                        name: "resource-balance/chart",
                        component: viewsresourcebalanceChart
                    },
                    {
                        path: "table",
                        name: "resource-balance/table",
                        component: viewsresourcebalanceTable
                    }
                ]
            },
            {
                redirect: {
                    name: "settings/common"
                },
                meta: {
                    color: "#888888"
                },
                path: "settings",
                name: "settings",
                component: viewssettingsIndex,
                children: [
                    {
                        path: "accessibility",
                        name: "settings/accessibility",
                        component: viewssettingsAccessibility
                    },
                    {
                        path: "colors",
                        name: "settings/colors",
                        component: viewssettingsColors
                    },
                    {
                        path: "combats",
                        name: "settings/combats",
                        component: viewssettingsCombats
                    },
                    {
                        path: "common",
                        name: "settings/common",
                        component: viewssettingsCommon
                    },
                    {
                        path: "danger-zone",
                        name: "settings/danger-zone",
                        component: viewssettingsDangerZone
                    },
                    {
                        path: "date-ranges",
                        name: "settings/date-ranges",
                        component: viewssettingsDateRanges
                    },
                    {
                        path: "debris-fields",
                        name: "settings/debris-fields",
                        component: viewssettingsDebrisFields
                    },
                    {
                        path: "expeditions",
                        name: "settings/expeditions",
                        component: viewssettingsExpeditions
                    },
                    {
                        path: "import-export",
                        name: "settings/import-export",
                        component: viewssettingsImportExport
                    },
                    {
                        path: "resource-balance",
                        name: "settings/resource-balance",
                        component: viewssettingsResourceBalance
                    },
                    {
                        path: "universe-history",
                        name: "settings/universe-history",
                        component: viewssettingsUniverseHistory
                    }
                ]
            },
            {
                redirect: {
                    name: "tools/signature-generator"
                },
                meta: {
                    color: "#008c85"
                },
                path: "tools",
                name: "tools",
                component: viewstoolsIndex,
                children: [
                    {
                        path: "construction-queue",
                        name: "tools/construction-queue",
                        component: viewstoolsConstructionQueue
                    },
                    {
                        path: "cost-calculator",
                        name: "tools/cost-calculator",
                        component: viewstoolsCostCalculator
                    },
                    {
                        path: "expedition-calculator",
                        name: "tools/expedition-calculator",
                        component: viewstoolsExpeditionCalculator
                    },
                    {
                        path: "production-calculator",
                        name: "tools/production-calculator",
                        component: viewstoolsProductionCalculator
                    },
                    {
                        path: "resource-conversion",
                        name: "tools/resource-conversion",
                        component: viewstoolsResourceConversion
                    },
                    {
                        path: "signature-generator",
                        name: "tools/signature-generator",
                        component: viewstoolsSignatureGenerator
                    }
                ]
            },
            {
                redirect: {
                    name: "universe-history/players"
                },
                meta: {
                    color: "#8b0436"
                },
                path: "universe-history",
                name: "universe-history",
                component: viewsuniversehistoryIndex,
                children: [
                    {
                        redirect: {
                            name: "universe-history/alliances/highscore"
                        },
                        path: "alliances",
                        name: "universe-history/alliances",
                        component: viewsuniversehistoryalliancesIndex,
                        children: [
                            {
                                path: "highscore",
                                name: "universe-history/alliances/highscore",
                                component: viewsuniversehistoryalliancesHighscore
                            },
                            {
                                path: "history",
                                name: "universe-history/alliances/history",
                                component: viewsuniversehistoryalliancesHistory
                            }
                        ]
                    },
                    {
                        redirect: {
                            name: "universe-history/players/highscore"
                        },
                        path: "players",
                        name: "universe-history/players",
                        component: viewsuniversehistoryplayersIndex,
                        children: [
                            {
                                path: "highscore",
                                name: "universe-history/players/highscore",
                                component: viewsuniversehistoryplayersHighscore
                            },
                            {
                                path: "history",
                                name: "universe-history/players/history",
                                component: viewsuniversehistoryplayersHistory
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
export default routes;