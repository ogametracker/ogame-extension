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
            costMsu: 'Cost (MSE)',
            productionPlus: 'Production Plus',
            productionPlusMsu: 'Production Plus (MSE)',
            amortizationTime: 'Amortization Time',
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
            },
        },
    },
};