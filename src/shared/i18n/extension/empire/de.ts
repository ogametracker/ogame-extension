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
            plasmatechSettings: {
                header: (name: string) => `Einstellungen zu ${name}`,
                includePlasmatech: (name: string) =>`${name} für Berechnung berücksichtigen`,
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
        },

        info: {
            generatingItems: 'Berechne nächste Einträge',

            slowCalculation: 'Die Amortisationsberechnung ist leider etwas langsam geworden, seitdem Lebensformen und deren Gebäude und Technologien berücksichtigt werden. Die Performance wird weiterhin untersucht und wird hoffentlich in der Zukunft verbessert.',
            ctrlClick: 'Strg + Klick auf eine Checkbox, um alle Elemente bis zum gewählten Element an-/abzuwählen.',
        },

        saveLoad: {
            saveButton: 'Amortisationsergebnisse speichern',
            loadButton: (date: string) => `Speicherstand laden (${date})`,
            loadedSave: (date: string) => `Speicherstand wird angezeigt (${date})`,
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
    },
};