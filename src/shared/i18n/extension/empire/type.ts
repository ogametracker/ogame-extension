import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
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
            crawlersToReachLimit: (count: string) => string;
        };
        items: string;
        breakdown: {
            basicIncome: string;
            mineProduction: string;
            consumption: string;
            lifeformBuildings: string;
            crawlers: string;
            items: string;
            geologist: string;
            commandStaff: string;
            playerClass: string;
            allianceClass: string;
            lifeformTechnologies: string;
        };

        settings: {
            reset: string;
            header: string;
            applyAndClose: string;
        };
    };
    amortization: {
        header: string;

        table: {
            cost: string;
            levels: string;
            productionPlus: string;
            amortizationTime: string;
            groupSelectedItems: string;
            showOriginalItems: string;

            levelsOnPlanets: (levels: number, planets: number) => string;
        };

        settings: {
            header: string;
            applyAndClose: string;

            playerSettings: {
                header: string;
                optimizeForResources: string;
                officers: string;
                playerClass: string;
                allianceClass: string;
                currentLevelOf: (name: string) => string;
                lifeformLevels: string;

                unusedRaidColonySlots: string;
            };
            astrophysicsSettings: {
                header: (name: string) => string;
                newColony: string;
            };
            plasmatechSettings: {
                header: (name: string) => string;
                includePlasmatech: (name: string) => string;
            };
            planetSettings: {
                header: string;

                global: {
                    deselectItems: string;
                    ignoreInactiveLifeformTechnologySlots: string;
                };

                includeInResult: string;
                position: string;
                maxTemperature: string;
                activeItems: string;
                crawlers: {
                    title: string;
                    percentage: string;
                    fixCount: string;
                    maxCount: string;
                };
                mines: string;

                lifeform: string;
                lifeformSettings: string;
                relevantLifeformBuildings: string;
                lifeformTechnologies: string;
                ignoreEmptySlots: string;
            };
            expeditionSettings: {
                header: string;
                includeInResult: string;
                averageWavesPerDay: string;
                items: string;
                averageExpeditionsPerDay: string;
                shipUnitFactors: string;
                topPlayerScore: string;
            };
        };

        info: {
            generatingItems: string;

            slowCalculation: string;
            ctrlClick: string;
        };

        saveLoad: {
            saveButton: string;
            loadButton: (date: string) => string;
            loadedSave: (date: string) => string;
            abandonedPlanet: string;
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

            researchBonuses: string;
        };

        planet: string;
        lifeform: string;
        buildings: string;
        technologies: string;
        tier: string;
        level: string;
        discoveredOn: string;
        discoveryDateUnknown: string;
        notDiscoveredYet: string;
        totalLifeformExperience: string;
        numberOfLifeformDiscoveries: string;
        alwaysAvailable: string;

        discoveryMissions: string;
        experiencePoints: string;
        lifeformFound: string;
        artifacts: string;
        eventTypes: Record<LifeformDiscoveryEventType, string>;
        artifactFindingSizes: Record<LifeformDiscoveryEventArtifactFindingSize, string>;

        researchBonuses: {
            breakdown: {
                slot: string;
                research: string;
                bonus: string;
                lifeformBuildingsBoost: (boost: string) => string;
                lifeformLevelBoost: (lifeform: string, boost: string) => string;
            };

            production: {
                header: string;
            };
            expeditionFinds: {
                header: string;
                resources: string;
                ships: string;
                fleetLoss: string;
            };
            expeditionSpeed: {
                header: string;
                bonus: string;
            };
            ships: {
                header: string;
                armor: string;
                shield: string;
                damage: string;
                cargo: string;
                speed: string;
            };
            defenses: {
                header: string;
            };
            fuelConsumption: {
                header: string;
            };
            fuelReturn: {
                header: string;
                bonus: string;
            };
            buildingCostTime: {
                header: string;
                cost: string;
                time: string;
            };
            researchCostTime: {
                header: string;
                researches: string;
                lifeformResearches: string;
            };
            crawlers: {
                header: string;
                productionBonus: string;
                energyConsumption: string;
            };
            denCapacity: {
                header: string;
            };
            phalanxRange: {
                header: string;
            };
            discoveryMissions: {
                header: string;
            };
            playerClasses: {
                header: string;

                collector: {
                    productionBonus: string;
                    energyProductionBonus: string;
                    transporterSpeedBonus: string;
                    transporterCargoBonus: string;
                    crawlerProductionBonus: string;
                    geologistCrawlerAmountBonus: string;
                };
                discoverer: {
                    researchDuration: string;
                    increasedExpeditionFinds: string;
                    largerPlanets: string;
                    additionalExpeditionSlots: string;
                    reducedExpeditionCombatChance: string;
                    phalanxRange: string;
                };
                general: {
                    combatShipSpeed: string;
                    recyclerSpeed: string;
                    fuelConsumption: string;
                    increasedCargoRecyclersPathfinders: string;
                    additionalCombatResearchLevels: string;
                    additionalFleetSlots: string;
                    additionalMoonFields: string;
                };

                classBonus: string;
                bonus: string;
                baseValue: string;
                valueWithBonuses: string;
            };
        };
    };
}