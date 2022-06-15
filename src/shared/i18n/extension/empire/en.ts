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

        mines: {
            crawlersAvailable: 'available',
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