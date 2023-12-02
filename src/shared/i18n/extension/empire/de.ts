import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { EmpireTranslations } from "./type";

export const de: EmpireTranslations = {
    header: 'Imperium',
    planet: 'Planet',
    production: {
        header: 'Produktion',
        subHeaders: {
            resourceProduction: 'Rohstoffproduktion',
            mineOverview: 'Minenübersicht',
        },
        averagePerHour: '⌀ pro Stunde',
        totalPerHour: 'gesamt pro Stunde',
        totalPerDay: 'gesamt pro Tag',
        totalPerWeek: 'gesamt pro Woche',
        activeProductionSettings: 'aktive Produktionseinstellungen',
        messageProduction100: 'Die angezeigten Werte beziehen sich auf einen Produktionsfaktor von 100% und berücksichtigen einen Energiemangel nicht.',

        mines: {
            crawlersAvailable: 'verfügbar',
            crawlersToReachLimit: count => `${count} Crawler für Maximalbonus`,
        },
        items: 'Aktive Items',
        breakdown: {
            basicIncome: 'Grundproduktion',
            mineProduction: 'Minenproduktion',
            consumption: 'Verbrauch',
            lifeformBuildings: 'Lebensform-Gebäude',
            crawlers: 'Crawler',
            items: 'Items',
            geologist: 'Geologe',
            commandStaff: 'Kommandostab',
            playerClass: 'Spielerklasse',
            allianceClass: 'Allianzklasse',
            lifeformTechnologies: 'Lebensform-Technologien',
        },

        settings: {
            reset: 'Zurücksetzen',
            header: 'Produktionseinstellungen',
            applyAndClose: 'Produktionseinstellungen anwenden und schließen',
        },
    },
    amortization: {
        header: 'Amortisation',

        table: {
            cost: 'Kosten',
            levels: 'Stufen',
            productionPlus: 'Produktionsplus',
            amortizationTime: 'Amortisationszeit',
            groupSelectedItems: 'Gewählte Elemente gruppieren',
            showOriginalItems: 'All Elemente einzeln anzeigen',

            levelsOnPlanets: (levels, planets) => `${levels} ${levels == 1 ? 'Stufe' : 'Stufen'} auf ${planets} Planeten`,
        },

        settings: {
            header: 'Einstellungen',
            applyAndClose: 'Einstellungen anwenden und schließen',

            includeSettings: {
                header: 'Für Berechnung berücksichtigen',

                mines: 'Minen',
                expeditions: 'Expeditionen',
                expeditionsRequirement: 'Hinweis: Benötigt Wahl von Lebensformforschungen und/oder Astrophysik',
                lifeformBuildings: 'Lebensformgebäude',
                lifeformTechnologies: 'Lebensformforschungen',
                astrophysicsAndColony: 'Astrophysik und neue Kolonien',
                astrophysicsPerformanceNote: 'Hinweis: Rechenintensiv, hat starken Einfluss auf Berechnungsgeschwindigkeit',
            },
            playerSettings: {
                header: 'Allgemeine Einstellungen',
                optimizeForResources: 'Für gewählte Rohstoffe optimieren',
                officers: 'Offiziere',
                playerClass: 'Spielerklasse',
                allianceClass: 'Allianzklasse',
                currentLevelOf: (name: string) => `aktuelle Stufe ${name}`,
                lifeformLevels: 'Lebenform-Levels',

                unusedRaidColonySlots: 'Derzeit ungenutzte Raidkolo-Slots',
            },
            astrophysicsSettings: {
                header: (name: string) => `Einstellungen zu ${name}`,
                newColony: 'neue Kolonie',
            },
            planetSettings: {
                header: 'Einstellungen der Planeten',

                global: {
                    deselectItems: 'Alle Items abwählen',
                    ignoreInactiveLifeformTechnologySlots: 'Inaktive Lebensform-Technologie-Slots für alle Planeten ignorieren',
                },

                includeInResult: 'für Berechnung berücksichtigen',
                position: 'Position',
                maxTemperature: 'Max. Temperatur',
                activeItems: 'Aktive Items',
                crawlers: {
                    title: 'Crawler',
                    percentage: '% Produktion',
                    fixCount: 'Feste Anzahl',
                    maxCount: 'Max. Anzahl',
                },
                mines: 'Aktuelle Minenstufen',

                lifeform: 'Lebensform',
                lifeformSettings: 'Lebensform-Einstellungen',
                relevantLifeformBuildings: 'Relevante Lebensform-Gebäude',
                lifeformTechnologies: 'Lebensform-Technologien',
                ignoreEmptySlots: 'Inaktive Slots ignorieren',
            },
            expeditionSettings: {
                header: 'Expeditionseinstellungen',
                averageWavesPerDay: '⌀ Wellen pro Tag',
                items: 'Slot-Items',
                averageExpeditionsPerDay: '⌀ Expeditionen pro Tag',
                shipUnitFactors: 'Faktoren für Schiffseinheiten',
                topPlayerScore: 'Punkte Platz 1',
            },
        },

        info: {
            generatingItems: 'Berechne nächste Einträge',

            slowCalculation: 'Die Amortisationsberechnung ist leider etwas langsam geworden, seitdem Lebensformen und deren Gebäude und Technologien berücksichtigt werden. Die Performance wird weiterhin untersucht und wird hoffentlich in der Zukunft verbessert.',
            ctrlClick: 'Strg + Klick auf eine Checkbox, um alle Elemente bis zum gewählten Element an-/abzuwählen.',
        },

        saveLoad: {
            saveButton: 'Amortisationsergebnisse speichern',
            loadButton: (date: string) => `Speicherstand laden (${date})`,
            loadedSave: (date: string, hiddenItems: string) => `Speicherstand wird angezeigt (${date}) - ${hiddenItems} ausgeblendete Zeilen`,
            abandonedPlanet: 'Aufgegebener Planet',
        },

        generateItems: value => `${value} Einträge`,
    },
    lifeforms: {
        header: 'Lebensformen',
        subHeaders: {
            overview: 'Übersicht',
            progress: 'Fortschritt',
            discoveryMissions: 'Missionen',

            discoveryResults: 'Ergebnisse',
            experience: 'Erfahrung',
            researchBonuses: 'Globale Forschungsboni',
            planetBonuses: 'Effektive Boni pro Planet',
        },

        planet: 'Planet',
        lifeform: 'Lebensform',
        buildings: 'Lebensform-Gebäude',
        technologies: 'Lebensform-Technologien',
        tier: 'Tier',
        level: 'Level',
        totalLifeformExperience: 'Erfahrung (gesamt)',
        discoveryDateUnknown: 'Unbekannt',
        notDiscoveredYet: 'Noch nicht entdeckt',
        discoveryMissions: 'Entdeckungsmissionen',
        eventTypes: {
            [LifeformDiscoveryEventType.nothing]: 'Kein Fund',
            [LifeformDiscoveryEventType.lostShip]: 'Schiff verloren',
            [LifeformDiscoveryEventType.newLifeformFound]: 'Neue Lebensform',
            [LifeformDiscoveryEventType.knownLifeformFound]: 'Lebensform-Erfahrung',
            [LifeformDiscoveryEventType.artifacts]: 'Artefaktfund',
        },
        artifactFindingSizes: {
            [LifeformDiscoveryEventArtifactFindingSize.small]: 'normaler Fund',
            [LifeformDiscoveryEventArtifactFindingSize.medium]: 'großer Fund',
            [LifeformDiscoveryEventArtifactFindingSize.large]: 'riesiger Fund',
            [LifeformDiscoveryEventArtifactFindingSize.storageFull]: 'Speicher voll',
        },
        lifeformFound: 'Lebensform gefunden',
        alwaysAvailable: 'Immer verfügbar',
        artifacts: 'Artefakte',

        experiencePoints: 'Erfahrungspunkte',
        discoveredOn: 'Lebensform entdeckt am',
        numberOfLifeformDiscoveries: 'Anzahl Entdeckungen',

        globalResearchBonus: 'Globaler Forschungsbonus',

        researchBonuses: {
            breakdown: {
                slot: 'Slot',
                research: 'Forschung',
                bonus: 'Bonus',
                lifeformBuildingsBoost: (boost: string) => `Lebensformgebäude-Boost (${boost})`,
                lifeformLevelBoost: (lifeform: string, boost: string) => `Lebensform-Level-Boost (${lifeform}: ${boost})`,
                bugBoost: 'durch Bugs verursachter Boost',
            },
            production: {
                header: 'Rohstoffproduktion',
            },
            expeditionFinds: {
                header: 'Expeditionsfunde',
                resources: 'Rohstoffe',
                ships: 'Schiffe',
                fleetLoss: 'Flottenverluste',
            },
            expeditionSpeed: {
                header: 'Geschwindigkeit zum Expeditionsort',
                bonus: 'Geschwindigkeitsbonus',
            },
            ships: {
                header: 'Schiffe',
                armor: 'Panzerung',
                shield: 'Schild',
                damage: 'Schaden',
                cargo: 'Laderaum',
                speed: 'Geschwindigkeit',
            },
            defenses: {
                header: 'Verteidigungsanlagen',
            },
            fuelConsumption: {
                header: 'Treibstoffverbrauch',
            },
            fuelReturn: {
                header: 'Treibstoffrückgewinn bei Rückruf',
                bonus: 'Treibstoffrückgewinn',
            },
            buildingCostTime: {
                header: 'Gebäude Kosten & Zeit',
                cost: 'Kosten',
                time: 'Zeit',
            },
            researchCostTime: {
                header: 'Forschungen Kosten & Zeit',
                researches: 'Forschungen',
                lifeformResearches: 'Lebensform-Forschungen',
            },
            crawlers: {
                header: 'Crawler',
                productionBonus: 'Rohstoffproduktion',
                energyConsumption: 'Energieverbrauch',
            },
            denCapacity: {
                header: 'Versteckkapazität',
            },
            phalanxRange: {
                header: 'Phalanx-Reichweite',
            },
            discoveryMissions: {
                header: 'Geschwindigkeit Entdeckungsmissionen',
            },
            playerClasses: {
                header: 'Spielerklassen',

                collector: {
                    productionBonus: 'Erhöhte Minenproduktion',
                    energyProductionBonus: 'Erhöhte Energieproduktion',
                    transporterSpeedBonus: 'Transporter-Geschwindigkeitsbonus',
                    transporterCargoBonus: 'Transporter-Laderaumbonus',
                    crawlerProductionBonus: 'Crawler-Produktionsbonus',
                    geologistCrawlerAmountBonus: 'Mehr verwendbare Crawler mit Geologe',
                },
                discoverer: {
                    researchDuration: 'Forschungszeit',
                    increasedExpeditionFinds: 'Erhöhter Ertrag bei Expeditionen',
                    largerPlanets: 'Größere Planeten bei Kolonisierung',
                    additionalExpeditionSlots: 'Zusätzliche Expeditionsslots',
                    reducedExpeditionCombatChance: 'Change auf Expeditionsgegner',
                    phalanxRange: 'Erhöhte Phalanx-Reichweite',
                },
                general: {
                    combatShipSpeed: 'Kampfschiff-Geschwindigkeitsbonus',
                    recyclerSpeed: 'Recycler-Geschwindigkeitsbonus',
                    fuelConsumption: 'Treibstoffverbrauch für alle Schiffe',
                    increasedCargoRecyclersPathfinders: 'Erhöhter Laderaum für Recycler/Pathfinder',
                    additionalCombatResearchLevels: 'Zusätzliche Kampfforschungsstufen',
                    additionalFleetSlots: 'Zusätzliche Flottenslots',
                    additionalMoonFields: 'Zusätzliche Mondfelder',
                },

                classBonus: 'Klassenbonus',
                bonus: 'Bonus',
                baseValue: 'Basiswert',
                valueWithBonuses: 'Wert inkl. Boni',
            },
        },

        planetBonuses: {
            resourceProduction: {
                header: 'Rohstoffproduktion',
            },
            lifeformResearchCostTime: {
                header: 'Lebensformforschungen Kosten & Zeit',
            },
            wreckfield: {
                header: 'Wrackfeld',
            },
        },
    },
};