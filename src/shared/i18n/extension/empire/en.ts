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
            plasmaTechnology: 'Plasma Technology',
            items: 'Items',
            geologist: 'Geologist',
            commandStaff: 'Command Staff',
            playerClass: 'Player Class',
            allianceClass: 'Alliance Class',
            lifeformTechnologies: 'Lifeform Technologies',
        },
    },
    amortization: {
        header: 'Amortization',

        table: {
            cost: 'Cost',
            productionPlus: 'Production Plus',
            amortizationTime: 'Amortization Time',

            levelsOnPlanets:(levels, planets) => `${levels} ${levels == 1 ? 'level' : 'levels'} on ${planets} ${planets == 1 ? 'planet' : 'planets'}`,
        },

        settings: {
            header: 'Settings',
            applyAndClose: 'Apply settings and close',

            playerSettings: {
                header: 'Player-wide Settings',
                officers: 'Officers',
                playerClass: 'Player Class',
                allianceClass: 'Alliance Class',
                currentLevelPlasmatech: 'Current Level of Plasmatechnology',
                currentLevelAstrophysics: 'Current Level of Astrophysics',

                unusedRaidColonySlots: 'Currently unused raid colony slots',
            },
            astrophysicsSettings: {
                header: 'Astrophysics Settings',
                showAstrophysics: 'Show astrophysics + new colonies in result',
                newColony: 'new Colony',
            },
            plasmatechSettings: {
                header: 'Plasmatechnology Settings',
                showPlasmatech: 'Show plasmatechnology in result',
            },
            planetSettings: {
                header: 'Planet Settings',

                showInResult: 'Show in result',
                ignore: 'Ignore for calulation',
                position: 'Position',
                maxTemperature: 'Max. Temperature',
                activeItems: 'Active Items',
                crawlers: {
                    title: 'Crawlers',
                    overload: '150% Overload',
                    fixCount: 'Fixed Count',
                    maxCount: 'Max. Count',
                },
                mines: 'Current Mine Levels',

                lifeform: 'Lifeform',
                lifeformSettings: 'Lifeform settings',
                relevantLifeformBuildings: 'Relevant Lifeform Buildings',
                lifeformTechnologies: 'Lifeform Technologies',
            },
        },

        info: {
            generatingItems: 'Calculation next best items',

            slowCalculation: 'The amortization calculation became pretty slow now that it includes lifeform buildings and technologies. This will hopefully be improved in the future.',
            ctrlClick: 'Ctrl + Click on a check to (de)select all items up to the selected one.',
        },
    },
    lifeforms: {
        header: 'Lifeforms',
        subHeaders: {
            overview: 'Overview',
            progress: 'Progress',
        },

        planet: 'Planet',
        lifeform: 'Lifeform',
        buildings: 'Lifeform Buildings',
        technologies: 'Lifeform Technologies',
        tier: 'Tier',
        lifeformLevel: 'Level',
        lifeformExperience: 'Experience',
        totalLifeformExperience: 'Experience (total)',
    },
};