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

        mines: {
            crawlersAvailable: 'verfügbar',
        },
        items: 'Aktive Items',
    },
    amortization: {
        header: 'Amortisation',

        table: {
            cost: 'Kosten',
            costMsu: 'Kosten (MSE)',
            productionPlus: 'Produktionsplus',
            productionPlusMsu: 'Produktionsplus (MSE)',
            amortizationTime: 'Amortisationszeit',
        },

        settings: {
            header: 'Einstellungen',
            applyAndClose: 'Einstellungen anwenden und schließen',

            playerSettings: {
                header: 'Spielerweite Einstellungen',
                officers: 'Offiziere',
                playerClass: 'Spielerklasse',
                allianceClass: 'Allianzklasse',
                currentLevelPlasmatech: 'aktuelle Stufe der Plasmatechnik',
                currentLevelAstrophysics: 'aktuelle Stufe der Astrophysik',
            },
            astrophysicsSettings: {
                header: 'Einstellungen zu Astrophysik',
                showAstrophysics: 'Astrophysik + neue Kolonien in Ergebnis anzeigen',
                newColony: 'neue Kolonie',
            },
            plasmatechSettings: {
                header: 'Einstellungen zu Plasmatechnik',
                showPlasmatech: 'Plasmatechnik in Ergebnis anzeigen',
            },
            planetSettings: {
                header: 'Einstellungen der Planeten',

                showInResult: 'in Ergebnis anzeigen',
                position: 'Position',
                maxTemperature: 'Max. Temperatur',
                activeItems: 'Aktive Items',
                crawlers: {
                    title: 'Crawler',
                    overload: '150% Überladung',
                    fixCount: 'Feste Anzahl',
                    maxCount: 'Max. Anzahl',
                },
                mines: 'Aktuelle Minenstufen',
            },
        },
    },
};