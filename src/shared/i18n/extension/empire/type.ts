export interface EmpireTranslations {
    header: string;
    planet: string;
    production: {
        header: string;
        subHeaders: {
            resourceProduction: string;
            mineOverview: string;
        };
        averagePerHour: string;
        totalPerHour: string;
        totalPerDay: string;
        totalPerWeek: string;
        activeProductionSettings: string;

        mines: {
            crawlersAvailable: string;
        };
    };
    amortization: {
        header: string;

        table: {
            cost: string;
            costMsu: string;
            productionPlus: string;
            productionPlusMsu: string;
            amortizationTime: string;
        };

        settings: {
            header: string;
            applyAndClose: string;

            playerSettings: {
                header: string;
                officers: string;
                playerClass: string;
                allianceClass: string;
                currentLevelPlasmatech: string;
                currentLevelAstrophysics: string;
            };
            astrophysicsSettings: {
                header: string;
                showAstrophysics: string;
                newColony: string;
            };
            plasmatechSettings: {
                header: string;
                showPlasmatech: string;
            };
            planetSettings: {
                header: string;

                showInResult: string;
                position: string;
                maxTemperature: string;
                activeItems: string;
                crawlers: {
                    title: string;
                    overload: string;
                    fixCount: string;
                    maxCount: string;
                };
                mines: string;
            };
        };
    };
}