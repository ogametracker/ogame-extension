
        import { RouteConfig } from 'vue-router';

        const routes: RouteConfig[] = [
    {
        redirect: {
            name: "expeditions"
        },
        path: "/",
        name: "",
        component: () => import(/* webpackChunkName: \"stats-view-viewsIndex\" */ '../views/Index.vue'),
        children: [
            {
                meta: {
                    color: "#ffca00"
                },
                path: "donate",
                name: "donate",
                component: () => import(/* webpackChunkName: \"stats-view-viewsDonate\" */ '../views/Donate.vue')
            },
            {
                meta: {
                    color: "#21a366"
                },
                path: "excel-export",
                name: "excel-export",
                component: () => import(/* webpackChunkName: \"stats-view-viewsExcelExport\" */ '../views/Excel-Export.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewsaboutIndex\" */ '../views/about/Index.vue'),
                children: [
                    {
                        path: "help",
                        name: "about/help",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsaboutHelp\" */ '../views/about/Help.vue')
                    },
                    {
                        path: "info",
                        name: "about/info",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsaboutInfo\" */ '../views/about/Info.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewscombatsIndex\" */ '../views/combats/Index.vue'),
                children: [
                    {
                        redirect: {
                            name: "combats/lost-ships/against-players"
                        },
                        path: "lost-ships",
                        name: "combats/lost-ships",
                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsIndex\" */ '../views/combats/lost-ships/Index.vue'),
                        children: [
                            {
                                redirect: {
                                    name: "combats/lost-ships/against-players/amount"
                                },
                                path: "against-players",
                                name: "combats/lost-ships/against-players",
                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsagainstplayersIndex\" */ '../views/combats/lost-ships/against-players/Index.vue'),
                                children: [
                                    {
                                        redirect: {
                                            name: "combats/lost-ships/against-players/amount/chart"
                                        },
                                        path: "amount",
                                        name: "combats/lost-ships/against-players/amount",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsagainstplayersamountIndex\" */ '../views/combats/lost-ships/against-players/amount/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "combats/lost-ships/against-players/amount/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsagainstplayersamountChart\" */ '../views/combats/lost-ships/against-players/amount/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "combats/lost-ships/against-players/amount/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsagainstplayersamountTable\" */ '../views/combats/lost-ships/against-players/amount/Table.vue')
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "combats/lost-ships/against-players/resources/chart"
                                        },
                                        path: "resources",
                                        name: "combats/lost-ships/against-players/resources",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsagainstplayersresourcesIndex\" */ '../views/combats/lost-ships/against-players/resources/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "combats/lost-ships/against-players/resources/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsagainstplayersresourcesChart\" */ '../views/combats/lost-ships/against-players/resources/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "combats/lost-ships/against-players/resources/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsagainstplayersresourcesTable\" */ '../views/combats/lost-ships/against-players/resources/Table.vue')
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
                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsonexpeditionsIndex\" */ '../views/combats/lost-ships/on-expeditions/Index.vue'),
                                children: [
                                    {
                                        redirect: {
                                            name: "combats/lost-ships/on-expeditions/amount/chart"
                                        },
                                        path: "amount",
                                        name: "combats/lost-ships/on-expeditions/amount",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsonexpeditionsamountIndex\" */ '../views/combats/lost-ships/on-expeditions/amount/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "combats/lost-ships/on-expeditions/amount/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsonexpeditionsamountChart\" */ '../views/combats/lost-ships/on-expeditions/amount/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "combats/lost-ships/on-expeditions/amount/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsonexpeditionsamountTable\" */ '../views/combats/lost-ships/on-expeditions/amount/Table.vue')
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "combats/lost-ships/on-expeditions/resources/chart"
                                        },
                                        path: "resources",
                                        name: "combats/lost-ships/on-expeditions/resources",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsonexpeditionsresourcesIndex\" */ '../views/combats/lost-ships/on-expeditions/resources/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "combats/lost-ships/on-expeditions/resources/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsonexpeditionsresourcesChart\" */ '../views/combats/lost-ships/on-expeditions/resources/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "combats/lost-ships/on-expeditions/resources/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatslostshipsonexpeditionsresourcesTable\" */ '../views/combats/lost-ships/on-expeditions/resources/Table.vue')
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
                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatsoverviewIndex\" */ '../views/combats/overview/Index.vue'),
                        children: [
                            {
                                redirect: {
                                    name: "combats/overview/against-players/chart"
                                },
                                path: "against-players",
                                name: "combats/overview/against-players",
                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatsoverviewagainstplayersIndex\" */ '../views/combats/overview/against-players/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "combats/overview/against-players/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatsoverviewagainstplayersChart\" */ '../views/combats/overview/against-players/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "combats/overview/against-players/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatsoverviewagainstplayersTable\" */ '../views/combats/overview/against-players/Table.vue')
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "combats/overview/on-expeditions/chart"
                                },
                                path: "on-expeditions",
                                name: "combats/overview/on-expeditions",
                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatsoverviewonexpeditionsIndex\" */ '../views/combats/overview/on-expeditions/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "combats/overview/on-expeditions/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatsoverviewonexpeditionsChart\" */ '../views/combats/overview/on-expeditions/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "combats/overview/on-expeditions/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatsoverviewonexpeditionsTable\" */ '../views/combats/overview/on-expeditions/Table.vue')
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
                        component: () => import(/* webpackChunkName: \"stats-view-viewscombatsresourcesIndex\" */ '../views/combats/resources/Index.vue'),
                        children: [
                            {
                                path: "chart",
                                name: "combats/resources/chart",
                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatsresourcesChart\" */ '../views/combats/resources/Chart.vue')
                            },
                            {
                                path: "table",
                                name: "combats/resources/table",
                                component: () => import(/* webpackChunkName: \"stats-view-viewscombatsresourcesTable\" */ '../views/combats/resources/Table.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewsdebrisfieldsIndex\" */ '../views/debris-fields/Index.vue'),
                children: [
                    {
                        path: "chart",
                        name: "debris-fields/chart",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsdebrisfieldsChart\" */ '../views/debris-fields/Chart.vue')
                    },
                    {
                        path: "table",
                        name: "debris-fields/table",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsdebrisfieldsTable\" */ '../views/debris-fields/Table.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewsempireIndex\" */ '../views/empire/Index.vue'),
                children: [
                    {
                        path: "amortization",
                        name: "empire/amortization",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsempireAmortization\" */ '../views/empire/Amortization.vue')
                    },
                    {
                        path: "point-distribution",
                        name: "empire/point-distribution",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirePointDistribution\" */ '../views/empire/Point-Distribution.vue')
                    },
                    {
                        redirect: {
                            name: "empire/lifeforms/overview"
                        },
                        path: "lifeforms",
                        name: "empire/lifeforms",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsIndex\" */ '../views/empire/lifeforms/Index.vue'),
                        children: [
                            {
                                path: "overview",
                                name: "empire/lifeforms/overview",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsOverview\" */ '../views/empire/lifeforms/Overview.vue')
                            },
                            {
                                path: "progress",
                                name: "empire/lifeforms/progress",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsProgress\" */ '../views/empire/lifeforms/Progress.vue')
                            },
                            {
                                redirect: {
                                    name: "empire/lifeforms/bonus-breakdown/resource-production"
                                },
                                path: "bonus-breakdown",
                                name: "empire/lifeforms/bonus-breakdown",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownIndex\" */ '../views/empire/lifeforms/bonus-breakdown/Index.vue'),
                                children: [
                                    {
                                        path: "building-cost-time",
                                        name: "empire/lifeforms/bonus-breakdown/building-cost-time",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownBuildingCostTime\" */ '../views/empire/lifeforms/bonus-breakdown/Building-Cost-Time.vue')
                                    },
                                    {
                                        path: "crawlers",
                                        name: "empire/lifeforms/bonus-breakdown/crawlers",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownCrawlers\" */ '../views/empire/lifeforms/bonus-breakdown/Crawlers.vue')
                                    },
                                    {
                                        path: "defenses",
                                        name: "empire/lifeforms/bonus-breakdown/defenses",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownDefenses\" */ '../views/empire/lifeforms/bonus-breakdown/Defenses.vue')
                                    },
                                    {
                                        path: "den-capacity",
                                        name: "empire/lifeforms/bonus-breakdown/den-capacity",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownDenCapacity\" */ '../views/empire/lifeforms/bonus-breakdown/Den-Capacity.vue')
                                    },
                                    {
                                        path: "discovery-missions",
                                        name: "empire/lifeforms/bonus-breakdown/discovery-missions",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownDiscoveryMissions\" */ '../views/empire/lifeforms/bonus-breakdown/Discovery-Missions.vue')
                                    },
                                    {
                                        path: "expedition-finds",
                                        name: "empire/lifeforms/bonus-breakdown/expedition-finds",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownExpeditionFinds\" */ '../views/empire/lifeforms/bonus-breakdown/Expedition-Finds.vue')
                                    },
                                    {
                                        path: "expedition-fleet-speed",
                                        name: "empire/lifeforms/bonus-breakdown/expedition-fleet-speed",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownExpeditionFleetSpeed\" */ '../views/empire/lifeforms/bonus-breakdown/Expedition-Fleet-Speed.vue')
                                    },
                                    {
                                        path: "fleet-fuel-return",
                                        name: "empire/lifeforms/bonus-breakdown/fleet-fuel-return",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownFleetFuelReturn\" */ '../views/empire/lifeforms/bonus-breakdown/Fleet-Fuel-Return.vue')
                                    },
                                    {
                                        path: "fuel-consumption",
                                        name: "empire/lifeforms/bonus-breakdown/fuel-consumption",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownFuelConsumption\" */ '../views/empire/lifeforms/bonus-breakdown/Fuel-Consumption.vue')
                                    },
                                    {
                                        path: "phalanx-range",
                                        name: "empire/lifeforms/bonus-breakdown/phalanx-range",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownPhalanxRange\" */ '../views/empire/lifeforms/bonus-breakdown/Phalanx-Range.vue')
                                    },
                                    {
                                        path: "player-class",
                                        name: "empire/lifeforms/bonus-breakdown/player-class",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownPlayerClass\" */ '../views/empire/lifeforms/bonus-breakdown/Player-Class.vue')
                                    },
                                    {
                                        path: "research-cost-time",
                                        name: "empire/lifeforms/bonus-breakdown/research-cost-time",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownResearchCostTime\" */ '../views/empire/lifeforms/bonus-breakdown/Research-Cost-Time.vue')
                                    },
                                    {
                                        path: "resource-production",
                                        name: "empire/lifeforms/bonus-breakdown/resource-production",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownResourceProduction\" */ '../views/empire/lifeforms/bonus-breakdown/Resource-Production.vue')
                                    },
                                    {
                                        path: "ships",
                                        name: "empire/lifeforms/bonus-breakdown/ships",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsbonusbreakdownShips\" */ '../views/empire/lifeforms/bonus-breakdown/Ships.vue')
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "empire/lifeforms/discoveries/overview"
                                },
                                path: "discoveries",
                                name: "empire/lifeforms/discoveries",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesIndex\" */ '../views/empire/lifeforms/discoveries/Index.vue'),
                                children: [
                                    {
                                        redirect: {
                                            name: "empire/lifeforms/discoveries/artifacts/amount"
                                        },
                                        path: "artifacts",
                                        name: "empire/lifeforms/discoveries/artifacts",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesartifactsIndex\" */ '../views/empire/lifeforms/discoveries/artifacts/Index.vue'),
                                        children: [
                                            {
                                                redirect: {
                                                    name: "empire/lifeforms/discoveries/artifacts/amount/chart"
                                                },
                                                path: "amount",
                                                name: "empire/lifeforms/discoveries/artifacts/amount",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesartifactsamountIndex\" */ '../views/empire/lifeforms/discoveries/artifacts/amount/Index.vue'),
                                                children: [
                                                    {
                                                        path: "chart",
                                                        name: "empire/lifeforms/discoveries/artifacts/amount/chart",
                                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesartifactsamountChart\" */ '../views/empire/lifeforms/discoveries/artifacts/amount/Chart.vue')
                                                    },
                                                    {
                                                        path: "table",
                                                        name: "empire/lifeforms/discoveries/artifacts/amount/table",
                                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesartifactsamountTable\" */ '../views/empire/lifeforms/discoveries/artifacts/amount/Table.vue')
                                                    }
                                                ]
                                            },
                                            {
                                                redirect: {
                                                    name: "empire/lifeforms/discoveries/artifacts/sizes/chart"
                                                },
                                                path: "sizes",
                                                name: "empire/lifeforms/discoveries/artifacts/sizes",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesartifactssizesIndex\" */ '../views/empire/lifeforms/discoveries/artifacts/sizes/Index.vue'),
                                                children: [
                                                    {
                                                        path: "chart",
                                                        name: "empire/lifeforms/discoveries/artifacts/sizes/chart",
                                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesartifactssizesChart\" */ '../views/empire/lifeforms/discoveries/artifacts/sizes/Chart.vue')
                                                    },
                                                    {
                                                        path: "table",
                                                        name: "empire/lifeforms/discoveries/artifacts/sizes/table",
                                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesartifactssizesTable\" */ '../views/empire/lifeforms/discoveries/artifacts/sizes/Table.vue')
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "empire/lifeforms/discoveries/experience/chart"
                                        },
                                        path: "experience",
                                        name: "empire/lifeforms/discoveries/experience",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesexperienceIndex\" */ '../views/empire/lifeforms/discoveries/experience/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "empire/lifeforms/discoveries/experience/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesexperienceChart\" */ '../views/empire/lifeforms/discoveries/experience/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "empire/lifeforms/discoveries/experience/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesexperienceTable\" */ '../views/empire/lifeforms/discoveries/experience/Table.vue')
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "empire/lifeforms/discoveries/overview/chart"
                                        },
                                        path: "overview",
                                        name: "empire/lifeforms/discoveries/overview",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesoverviewIndex\" */ '../views/empire/lifeforms/discoveries/overview/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "empire/lifeforms/discoveries/overview/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesoverviewChart\" */ '../views/empire/lifeforms/discoveries/overview/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "empire/lifeforms/discoveries/overview/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsempirelifeformsdiscoveriesoverviewTable\" */ '../views/empire/lifeforms/discoveries/overview/Table.vue')
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
                        component: () => import(/* webpackChunkName: \"stats-view-viewsempireproductionIndex\" */ '../views/empire/production/Index.vue'),
                        children: [
                            {
                                path: "mines",
                                name: "empire/production/mines",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsempireproductionMines\" */ '../views/empire/production/Mines.vue')
                            },
                            {
                                path: "resources",
                                name: "empire/production/resources",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsempireproductionResources\" */ '../views/empire/production/Resources.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewsespionageIndex\" */ '../views/espionage/Index.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsIndex\" */ '../views/expeditions/Index.vue'),
                children: [
                    {
                        redirect: {
                            name: "expeditions/dark-matter/amount"
                        },
                        path: "dark-matter",
                        name: "expeditions/dark-matter",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdarkmatterIndex\" */ '../views/expeditions/dark-matter/Index.vue'),
                        children: [
                            {
                                redirect: {
                                    name: "expeditions/dark-matter/amount/chart"
                                },
                                path: "amount",
                                name: "expeditions/dark-matter/amount",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdarkmatteramountIndex\" */ '../views/expeditions/dark-matter/amount/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/dark-matter/amount/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdarkmatteramountChart\" */ '../views/expeditions/dark-matter/amount/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/dark-matter/amount/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdarkmatteramountTable\" */ '../views/expeditions/dark-matter/amount/Table.vue')
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/dark-matter/sizes/chart"
                                },
                                path: "sizes",
                                name: "expeditions/dark-matter/sizes",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdarkmattersizesIndex\" */ '../views/expeditions/dark-matter/sizes/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/dark-matter/sizes/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdarkmattersizesChart\" */ '../views/expeditions/dark-matter/sizes/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/dark-matter/sizes/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdarkmattersizesTable\" */ '../views/expeditions/dark-matter/sizes/Table.vue')
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
                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdepletionIndex\" */ '../views/expeditions/depletion/Index.vue'),
                        children: [
                            {
                                path: "chart",
                                name: "expeditions/depletion/chart",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdepletionChart\" */ '../views/expeditions/depletion/Chart.vue')
                            },
                            {
                                path: "table",
                                name: "expeditions/depletion/table",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsdepletionTable\" */ '../views/expeditions/depletion/Table.vue')
                            }
                        ]
                    },
                    {
                        redirect: {
                            name: "expeditions/info/largest-finds"
                        },
                        path: "info",
                        name: "expeditions/info",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsinfoIndex\" */ '../views/expeditions/info/Index.vue'),
                        children: [
                            {
                                path: "largest-finds",
                                name: "expeditions/info/largest-finds",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsinfoLargestFinds\" */ '../views/expeditions/info/Largest-Finds.vue')
                            },
                            {
                                path: "possible-finds",
                                name: "expeditions/info/possible-finds",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsinfoPossibleFinds\" */ '../views/expeditions/info/Possible-Finds.vue')
                            }
                        ]
                    },
                    {
                        path: "items",
                        name: "expeditions/items",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsitemsIndex\" */ '../views/expeditions/items/Index.vue')
                    },
                    {
                        redirect: {
                            name: "expeditions/overview/chart"
                        },
                        path: "overview",
                        name: "expeditions/overview",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsoverviewIndex\" */ '../views/expeditions/overview/Index.vue'),
                        children: [
                            {
                                path: "chart",
                                name: "expeditions/overview/chart",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsoverviewChart\" */ '../views/expeditions/overview/Chart.vue')
                            },
                            {
                                path: "table",
                                name: "expeditions/overview/table",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsoverviewTable\" */ '../views/expeditions/overview/Table.vue')
                            }
                        ]
                    },
                    {
                        redirect: {
                            name: "expeditions/resources/amount"
                        },
                        path: "resources",
                        name: "expeditions/resources",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcesIndex\" */ '../views/expeditions/resources/Index.vue'),
                        children: [
                            {
                                redirect: {
                                    name: "expeditions/resources/amount/chart"
                                },
                                path: "amount",
                                name: "expeditions/resources/amount",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcesamountIndex\" */ '../views/expeditions/resources/amount/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/resources/amount/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcesamountChart\" */ '../views/expeditions/resources/amount/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/resources/amount/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcesamountTable\" */ '../views/expeditions/resources/amount/Table.vue')
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/resources/count/chart"
                                },
                                path: "count",
                                name: "expeditions/resources/count",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcescountIndex\" */ '../views/expeditions/resources/count/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/resources/count/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcescountChart\" */ '../views/expeditions/resources/count/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/resources/count/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcescountTable\" */ '../views/expeditions/resources/count/Table.vue')
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/resources/size-breakdown/metal"
                                },
                                path: "size-breakdown",
                                name: "expeditions/resources/size-breakdown",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdownIndex\" */ '../views/expeditions/resources/size-breakdown/Index.vue'),
                                children: [
                                    {
                                        redirect: {
                                            name: "expeditions/resources/size-breakdown/crystal/chart"
                                        },
                                        path: "crystal",
                                        name: "expeditions/resources/size-breakdown/crystal",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdowncrystalIndex\" */ '../views/expeditions/resources/size-breakdown/crystal/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "expeditions/resources/size-breakdown/crystal/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdowncrystalChart\" */ '../views/expeditions/resources/size-breakdown/crystal/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "expeditions/resources/size-breakdown/crystal/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdowncrystalTable\" */ '../views/expeditions/resources/size-breakdown/crystal/Table.vue')
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "expeditions/resources/size-breakdown/deuterium/chart"
                                        },
                                        path: "deuterium",
                                        name: "expeditions/resources/size-breakdown/deuterium",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdowndeuteriumIndex\" */ '../views/expeditions/resources/size-breakdown/deuterium/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "expeditions/resources/size-breakdown/deuterium/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdowndeuteriumChart\" */ '../views/expeditions/resources/size-breakdown/deuterium/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "expeditions/resources/size-breakdown/deuterium/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdowndeuteriumTable\" */ '../views/expeditions/resources/size-breakdown/deuterium/Table.vue')
                                            }
                                        ]
                                    },
                                    {
                                        redirect: {
                                            name: "expeditions/resources/size-breakdown/metal/chart"
                                        },
                                        path: "metal",
                                        name: "expeditions/resources/size-breakdown/metal",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdownmetalIndex\" */ '../views/expeditions/resources/size-breakdown/metal/Index.vue'),
                                        children: [
                                            {
                                                path: "chart",
                                                name: "expeditions/resources/size-breakdown/metal/chart",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdownmetalChart\" */ '../views/expeditions/resources/size-breakdown/metal/Chart.vue')
                                            },
                                            {
                                                path: "table",
                                                name: "expeditions/resources/size-breakdown/metal/table",
                                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizebreakdownmetalTable\" */ '../views/expeditions/resources/size-breakdown/metal/Table.vue')
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/resources/sizes/chart"
                                },
                                path: "sizes",
                                name: "expeditions/resources/sizes",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizesIndex\" */ '../views/expeditions/resources/sizes/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/resources/sizes/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizesChart\" */ '../views/expeditions/resources/sizes/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/resources/sizes/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsresourcessizesTable\" */ '../views/expeditions/resources/sizes/Table.vue')
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
                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipsIndex\" */ '../views/expeditions/ships/Index.vue'),
                        children: [
                            {
                                redirect: {
                                    name: "expeditions/ships/amount/chart"
                                },
                                path: "amount",
                                name: "expeditions/ships/amount",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipsamountIndex\" */ '../views/expeditions/ships/amount/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/ships/amount/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipsamountChart\" */ '../views/expeditions/ships/amount/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/ships/amount/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipsamountTable\" */ '../views/expeditions/ships/amount/Table.vue')
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/ships/resources/chart"
                                },
                                path: "resources",
                                name: "expeditions/ships/resources",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipsresourcesIndex\" */ '../views/expeditions/ships/resources/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/ships/resources/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipsresourcesChart\" */ '../views/expeditions/ships/resources/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/ships/resources/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipsresourcesTable\" */ '../views/expeditions/ships/resources/Table.vue')
                                    }
                                ]
                            },
                            {
                                redirect: {
                                    name: "expeditions/ships/sizes/chart"
                                },
                                path: "sizes",
                                name: "expeditions/ships/sizes",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipssizesIndex\" */ '../views/expeditions/ships/sizes/Index.vue'),
                                children: [
                                    {
                                        path: "chart",
                                        name: "expeditions/ships/sizes/chart",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipssizesChart\" */ '../views/expeditions/ships/sizes/Chart.vue')
                                    },
                                    {
                                        path: "table",
                                        name: "expeditions/ships/sizes/table",
                                        component: () => import(/* webpackChunkName: \"stats-view-viewsexpeditionsshipssizesTable\" */ '../views/expeditions/ships/sizes/Table.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewsresourcebalanceIndex\" */ '../views/resource-balance/Index.vue'),
                children: [
                    {
                        path: "chart",
                        name: "resource-balance/chart",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsresourcebalanceChart\" */ '../views/resource-balance/Chart.vue')
                    },
                    {
                        path: "table",
                        name: "resource-balance/table",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsresourcebalanceTable\" */ '../views/resource-balance/Table.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewssettingsIndex\" */ '../views/settings/Index.vue'),
                children: [
                    {
                        path: "accessibility",
                        name: "settings/accessibility",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsAccessibility\" */ '../views/settings/Accessibility.vue')
                    },
                    {
                        path: "colors",
                        name: "settings/colors",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsColors\" */ '../views/settings/Colors.vue')
                    },
                    {
                        path: "combats",
                        name: "settings/combats",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsCombats\" */ '../views/settings/Combats.vue')
                    },
                    {
                        path: "common",
                        name: "settings/common",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsCommon\" */ '../views/settings/Common.vue')
                    },
                    {
                        path: "danger-zone",
                        name: "settings/danger-zone",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsDangerZone\" */ '../views/settings/Danger-Zone.vue')
                    },
                    {
                        path: "date-ranges",
                        name: "settings/date-ranges",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsDateRanges\" */ '../views/settings/Date-Ranges.vue')
                    },
                    {
                        path: "debris-fields",
                        name: "settings/debris-fields",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsDebrisFields\" */ '../views/settings/Debris-Fields.vue')
                    },
                    {
                        path: "expeditions",
                        name: "settings/expeditions",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsExpeditions\" */ '../views/settings/Expeditions.vue')
                    },
                    {
                        path: "import-export",
                        name: "settings/import-export",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsImportExport\" */ '../views/settings/Import-Export.vue')
                    },
                    {
                        path: "linked-accounts",
                        name: "settings/linked-accounts",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsLinkedAccounts\" */ '../views/settings/Linked-Accounts.vue')
                    },
                    {
                        path: "resource-balance",
                        name: "settings/resource-balance",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsResourceBalance\" */ '../views/settings/Resource-Balance.vue')
                    },
                    {
                        path: "universe-history",
                        name: "settings/universe-history",
                        component: () => import(/* webpackChunkName: \"stats-view-viewssettingsUniverseHistory\" */ '../views/settings/Universe-History.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewstoolsIndex\" */ '../views/tools/Index.vue'),
                children: [
                    {
                        path: "construction-queue",
                        name: "tools/construction-queue",
                        component: () => import(/* webpackChunkName: \"stats-view-viewstoolsConstructionQueue\" */ '../views/tools/Construction-Queue.vue')
                    },
                    {
                        path: "cost-calculator",
                        name: "tools/cost-calculator",
                        component: () => import(/* webpackChunkName: \"stats-view-viewstoolsCostCalculator\" */ '../views/tools/Cost-Calculator.vue')
                    },
                    {
                        path: "expedition-calculator",
                        name: "tools/expedition-calculator",
                        component: () => import(/* webpackChunkName: \"stats-view-viewstoolsExpeditionCalculator\" */ '../views/tools/Expedition-Calculator.vue')
                    },
                    {
                        path: "production-calculator",
                        name: "tools/production-calculator",
                        component: () => import(/* webpackChunkName: \"stats-view-viewstoolsProductionCalculator\" */ '../views/tools/Production-Calculator.vue')
                    },
                    {
                        path: "resource-conversion",
                        name: "tools/resource-conversion",
                        component: () => import(/* webpackChunkName: \"stats-view-viewstoolsResourceConversion\" */ '../views/tools/Resource-Conversion.vue')
                    },
                    {
                        path: "scrapyard-merchant",
                        name: "tools/scrapyard-merchant",
                        component: () => import(/* webpackChunkName: \"stats-view-viewstoolsScrapyardMerchant\" */ '../views/tools/Scrapyard-Merchant.vue')
                    },
                    {
                        path: "signature-generator",
                        name: "tools/signature-generator",
                        component: () => import(/* webpackChunkName: \"stats-view-viewstoolsSignatureGenerator\" */ '../views/tools/Signature-Generator.vue')
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
                component: () => import(/* webpackChunkName: \"stats-view-viewsuniversehistoryIndex\" */ '../views/universe-history/Index.vue'),
                children: [
                    {
                        redirect: {
                            name: "universe-history/alliances/highscore"
                        },
                        path: "alliances",
                        name: "universe-history/alliances",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsuniversehistoryalliancesIndex\" */ '../views/universe-history/alliances/Index.vue'),
                        children: [
                            {
                                path: "highscore",
                                name: "universe-history/alliances/highscore",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsuniversehistoryalliancesHighscore\" */ '../views/universe-history/alliances/Highscore.vue')
                            },
                            {
                                path: "history",
                                name: "universe-history/alliances/history",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsuniversehistoryalliancesHistory\" */ '../views/universe-history/alliances/History.vue')
                            }
                        ]
                    },
                    {
                        redirect: {
                            name: "universe-history/players/highscore"
                        },
                        path: "players",
                        name: "universe-history/players",
                        component: () => import(/* webpackChunkName: \"stats-view-viewsuniversehistoryplayersIndex\" */ '../views/universe-history/players/Index.vue'),
                        children: [
                            {
                                path: "highscore",
                                name: "universe-history/players/highscore",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsuniversehistoryplayersHighscore\" */ '../views/universe-history/players/Highscore.vue')
                            },
                            {
                                path: "history",
                                name: "universe-history/players/history",
                                component: () => import(/* webpackChunkName: \"stats-view-viewsuniversehistoryplayersHistory\" */ '../views/universe-history/players/History.vue')
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

        export default routes;
        