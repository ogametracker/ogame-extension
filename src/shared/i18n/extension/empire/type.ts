import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";

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
        messageProduction100: string;

        mines: {
            crawlersAvailable: string;
        };
        items: string;
        breakdown: {
            basicIncome: string;
            mineProduction: string;
            consumption: string;
            lifeformBuildings: string;
            crawlers: string;
            plasmaTechnology: string;
            items: string;
            geologist: string;
            commandStaff: string;
            playerClass: string;
            allianceClass: string;
            lifeformTechnologies: string;
        };
    };
    amortization: {
        header: string;

        table: {
            cost: string;
            productionPlus: string;
            amortizationTime: string;

            levelsOnPlanets: (levels: number, planets: number) => string;
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

                unusedRaidColonySlots: string;
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
                ignore: string;
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

                lifeform: string;
                lifeformSettings: string;
                relevantLifeformBuildings: string;
                lifeformTechnologies: string;
            };
        };

        info: {
            generatingItems: string;

            slowCalculation: string;
            ctrlClick: string;
        };

        generateItems: (value: string) => string;
    };
    lifeforms: {
        header: string;
        subHeaders: {
            overview: string;
            progress: string;
            discoveryMissions: string;

            discoveryResults: string;
            experience: string;
        };

        planet: string;
        lifeform: string;
        buildings: string;
        technologies: string;
        tier: string;
        level: string;
        discoveryDateUnknown: string;
        notDiscoveredYet: string;
        totalLifeformExperience: string;

        discoveryMissions: string;
        lifeformFound: string;
        eventTypes: Record<LifeformDiscoveryEventType, string>;
    };
}