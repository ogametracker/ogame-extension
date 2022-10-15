import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { EmpireTranslations } from "./type";

export const en: EmpireTranslations = {
    header: 'Empire',
    planet: 'Planet',
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

            levelsOnPlanets:(levels, planets) => `${levels} ${levels == 1 ? 'level' : 'levels'} on ${planets} ${planets == 1 ? 'planet' : 'planets'}`,
        },

        settings: {
            header: 'Settings',
            applyAndClose: 'Apply settings and close',

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
            plasmatechSettings: {
                header: (name: string) => `${name} Settings`,
                includePlasmatech: (name: string) => `Include ${name} in calculation`,
            },
            planetSettings: {
                header: 'Planet Settings',

                global: {
                    deselectItems: 'Deselect all items',
                    ignoreInactiveLifeformTechnologySlots: 'Ignore inactive lifeform technology slots for all planets',
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
        },

        info: {
            generatingItems: 'Calculating next best items',

            slowCalculation: 'The amortization calculation became pretty slow now that it includes lifeform buildings and technologies. This will hopefully be improved in the future.',
            ctrlClick: 'Ctrl + Click on a check to (de)select all items up to the selected one.',
        },

        saveLoad: {
            saveButton: 'Save calculated amortization results',
            loadButton: (date: string) => `Load save (${date})`,
            loadedSave: (date: string) => `Viewing saved results (${date})`,
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
        },
        lifeformFound: 'Lifeform found',
        alwaysAvailable: 'Always available',

        experiencePoints: 'Experience Points',
        discoveredOn: 'Lifeform discovered on',
        numberOfLifeformDiscoveries: 'Number of discoveries',
    },
};