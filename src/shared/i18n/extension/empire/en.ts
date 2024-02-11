import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { EmpireTranslations } from "./type";

export const en: EmpireTranslations = {
    header: 'Empire',
    planet: 'Planet',
    overview: {
        header: 'Overview',
        supplyBuildings: 'Supply Buildings',
        facilityBuildings: 'Facilities',
    },
    production: {
        header: 'Production',
        subHeaders: {
            resourceProduction: 'Resource Production',
            mineOverview: 'Mine Overview',
        },
        averagePerHour: '⌀ per hour',
        totalPerHour: 'total per hour',
        totalPerDay: 'total per day',
        totalPerWeek: 'total per week',
        activeProductionSettings: 'Active Production Settings',
        messageProduction100: 'The shown values refer to a production factor of 100% and do not take lack of energy into account.',

        mines: {
            crawlersAvailable: 'available',
            crawlersToReachLimit: count => `${count} crawlers for maximum bonus`,
        },
        items: 'Active items',
        breakdown: {
            basicIncome: 'Basic Income',
            mineProduction: 'Mine Production',
            consumption: 'Consumption',
            lifeformBuildings: 'Lifeform Buildings',
            crawlers: 'Crawlers',
            items: 'Items',
            geologist: 'Geologist',
            commandStaff: 'Command Staff',
            playerClass: 'Player Class',
            allianceClass: 'Alliance Class',
            lifeformTechnologies: 'Lifeform Technologies',
        },

        settings: {
            reset: 'Reset',
            header: 'Production settings',
            applyAndClose: 'Apply and close production settings',
        },
    },
    amortization: {
        header: 'Amortization',

        table: {
            cost: 'Cost',
            levels: 'Levels',
            productionPlus: 'Production Plus',
            amortizationTime: 'Amortization Time',
            groupSelectedItems: 'Group selected items',
            showOriginalItems: 'Show all items individually',

            levelsOnPlanets: (levels, planets) => `${levels} ${levels == 1 ? 'level' : 'levels'} on ${planets} ${planets == 1 ? 'planet' : 'planets'}`,
        },

        settings: {
            header: 'Settings',
            applyAndClose: 'Apply settings and close',

            includeSettings: {
                header: 'Include in calculation',

                mines: 'Mines',
                expeditions: 'Expeditions',
                expeditionsRequirement: 'Note: Requires at least one of lifeform expedition bonus researches, lifeform research bonus buildings, and astrophysics to be selected',
                lifeformProductionBonusBuildings: 'Lifeform production bonus buildings',
                lifeformTechnologyBoostBuildings: 'Lifeform research bonus buildings',
                lifeformProductionBonusTechnologies: 'Lifeform production bonus researches',
                lifeformExpeditionBonusTechnologies: 'Lifeform expedition bonus researches',
                astrophysicsAndColony: 'Astrophysics and new colonies',
                astrophysicsPerformanceNote: 'Note: Computationally intensive, will greatly affect performance',
            },
            playerSettings: {
                header: 'General Settings',
                optimizeForResources: 'Optimize for selected resources',
                officers: 'Officers',
                playerClass: 'Player Class',
                allianceClass: 'Alliance Class',
                currentLevelOf: (name: string) => `Current Level of ${name}`,
                lifeformLevels: 'Lifeform Levels',

                unusedRaidColonySlots: 'Currently unused raid colony slots',
            },
            astrophysicsSettings: {
                header: (name: string) => `${name} Settings`,
                newColony: 'new Colony',
            },
            planetSettings: {
                header: 'Planet Settings',

                global: {
                    deselectItems: 'Deselect all items',
                    ignoreInactiveLifeformTechnologySlots: 'Ignore inactive lifeform technology slots for all planets',
                    deselectAllPlanets: 'Deselect all planets',
                },

                includeInResult: 'Include in calculation',
                position: 'Position',
                maxTemperature: 'Max. Temperature',
                activeItems: 'Active Items',
                crawlers: {
                    title: 'Crawlers',
                    percentage: '% Production',
                    fixCount: 'Fixed Count',
                    maxCount: 'Max. Count',
                },
                mines: 'Current Mine Levels',

                lifeform: 'Lifeform',
                lifeformSettings: 'Lifeform settings',
                relevantLifeformBuildings: 'Relevant Lifeform Buildings',
                lifeformTechnologies: 'Lifeform Technologies',
                ignoreEmptySlots: 'Ignore inactive slots',
            },
            expeditionSettings: {
                header: 'Expedition Settings',
                averageWavesPerDay: '⌀ Waves per day',
                items: 'Slot items',
                averageExpeditionsPerDay: '⌀ Expeditions per day',
                shipUnitFactors: 'Ship resource unit factors',
                topPlayerScore: 'Top player score',
            },
        },

        info: {
            generatingItems: 'Calculating next best items',

            slowCalculation: 'The amortization calculation became pretty slow now that it includes lifeform buildings and technologies. This will hopefully be improved in the future.',
            ctrlClick: 'Ctrl + Click on a check to (de)select all items up to the selected one.',
        },

        saveLoad: {
            saveButton: 'Save calculated amortization results',
            loadButton: (date: string) => `Load save (${date})`,
            loadedSave: (date: string, hiddenItems: string) => `Viewing saved results (${date}) - ${hiddenItems} hidden rows`,
            abandonedPlanet: 'Abandoned Planet',
        },

        generateItems: value => `${value} entries`,
    },
    lifeforms: {
        header: 'Lifeforms',
        subHeaders: {
            overview: 'Overview',
            progress: 'Progress',
            discoveryMissions: 'Missions',

            discoveryResults: 'Results',
            experience: 'Experience',
            researchBonuses: 'Global Research Bonuses',
            planetBonuses: 'Effective Planet Bonuses',
        },

        planet: 'Planet',
        lifeform: 'Lifeform',
        buildings: 'Lifeform Buildings',
        technologies: 'Lifeform Technologies',
        tier: 'Tier',
        level: 'Level',
        totalLifeformExperience: 'Experience (total)',
        discoveryDateUnknown: 'Unknown',
        notDiscoveredYet: 'Not discovered yet',
        discoveryMissions: 'Discovery Missions',
        eventTypes: {
            [LifeformDiscoveryEventType.nothing]: 'No finding',
            [LifeformDiscoveryEventType.lostShip]: 'Lost exploration ship',
            [LifeformDiscoveryEventType.newLifeformFound]: 'New lifeform',
            [LifeformDiscoveryEventType.knownLifeformFound]: 'Lifeform experience',
            [LifeformDiscoveryEventType.artifacts]: 'Artifacts found',
        },
        artifactFindingSizes: {
            [LifeformDiscoveryEventArtifactFindingSize.small]: 'Common Find',
            [LifeformDiscoveryEventArtifactFindingSize.medium]: 'Large Find',
            [LifeformDiscoveryEventArtifactFindingSize.large]: 'Huge Find',
            [LifeformDiscoveryEventArtifactFindingSize.storageFull]: 'Storage Full',
        },
        lifeformFound: 'Lifeform found',
        alwaysAvailable: 'Always available',
        artifacts: 'Artifacts',

        experiencePoints: 'Experience Points',
        discoveredOn: 'Lifeform discovered on',
        numberOfLifeformDiscoveries: 'Number of discoveries',

        globalResearchBonus: 'Global research bonus',

        researchBonuses: {
            breakdown: {
                slot: 'Slot',
                research: 'Research',
                bonus: 'Bonus',
                lifeformBuildingsBoost: (boost: string) => `Lifeform Building Boost (${boost})`,
                lifeformLevelBoost: (lifeform: string, boost: string) => `Lifeform Level Boost (${lifeform}: ${boost})`,
                bugBoost: 'Boost caused by bugs',
            },
            production: {
                header: 'Resource Production',
            },
            expeditionFinds: {
                header: 'Expedition Finds',
                resources: 'Resources',
                ships: 'Ships',
                fleetLoss: 'Fleet losses',
            },
            expeditionSpeed: {
                header: 'Expedition Arrival Speed',
                bonus: 'Speed Bonus',
            },
            ships: {
                header: 'Ships',
                armor: 'Armor',
                shield: 'Shield',
                damage: 'Damage',
                cargo: 'Cargo',
                speed: 'Speed',
            },
            defenses: {
                header: 'Defenses',
            },
            fuelConsumption: {
                header: 'Fuel Consumption',
            },
            fuelReturn: {
                header: 'Fuel Return on Recall',
                bonus: 'Fuel Return',
            },
            buildingCostTime: {
                header: 'Building Cost & Time',
                cost: 'Cost',
                time: 'Time',
            },
            researchCostTime: {
                header: 'Research Cost & Time',
                researches: 'Researches',
                lifeformResearches: 'Lifeform Researches',
            },
            crawlers: {
                header: 'Crawlers',
                productionBonus: 'Resource Production',
                energyConsumption: 'Energy Consumption',
            },
            denCapacity: {
                header: 'Den Capacity',
            },
            phalanxRange: {
                header: 'Phalanx Range',
            },
            discoveryMissions: {
                header: 'Discovery Mission Speed',
            },
            playerClasses: {
                header: 'Player Classes',

                collector: {
                    productionBonus: 'Increased mine production',
                    energyProductionBonus: 'Increased energy production',
                    transporterSpeedBonus: 'Transporter speed bonus',
                    transporterCargoBonus: 'Transporter cargo bonus',
                    crawlerProductionBonus: 'Crawler production bonus',
                    geologistCrawlerAmountBonus: 'More usable crawlers with Geologist',
                },
                discoverer: {
                    researchDuration: 'Research time',
                    increasedExpeditionFinds: 'Increased gain on expeditions',
                    largerPlanets: 'Larger planets on colonization',
                    additionalExpeditionSlots: 'Additional expedition slots',
                    reducedExpeditionCombatChance: 'Chance of expedition combats',
                    phalanxRange: 'Increased phalanx range',
                },
                general: {
                    combatShipSpeed: 'Combat ship speed bonus',
                    recyclerSpeed: 'recycler speed bonus',
                    fuelConsumption: 'Fuel consumption for all ships',
                    increasedCargoRecyclersPathfinders: 'Increased cargo for Recyclers/Pathfinders',
                    additionalCombatResearchLevels: 'Additional combat research levels',
                    additionalFleetSlots: 'Additional fleet slots',
                    additionalMoonFields: 'Additional moon fields',
                },

                classBonus: 'Class Bonus',
                bonus: 'Bonus',
                baseValue: 'Base Value',
                valueWithBonuses: 'Value with Bonuses',
            },
        },

        planetBonuses: {
            resourceProduction: {
                header: 'Resource Production',
            },
            lifeformResearchCostTime: {
                header: 'Lifeform Research Cost & Time',
            },
            wreckfield: {
                header: 'Wreckfield',
            },
        },

        topFinds: {
            topFinds: 'Best Finds',
            worstFinds: 'Worst Finds',

            size: 'Size',
            amount: 'Amount',
            date: 'Date',
            artifacts: 'Artifacts',
            experience: 'XP',
        },
    },
};