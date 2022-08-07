import { ExcelExportTranslations } from "./type";

export const de: ExcelExportTranslations = {
    header: 'Excel-Export',
    chooseBelowMessage: 'Wähle die zu exportierenden Daten:',
    groups: {
        expeditions: {
            header: 'Expeditionen',
            rawData: 'Rohdaten (jede einzelne getrackte Expedition)',
            dailyOverview: 'Übersicht über Ergebnisse pro Tag',
            dailyDepletion: 'Übersicht über Systemauslastung pro Tag',
            dailyResources: 'Rohstofffunde pro Tag',
            dailyResourceSizes: 'Größen der Rohstofffunde pro Tag',
            dailyShips: 'Schiffsfunde pro Tag',
            dailyShipSizes: 'Größen der Schiffsfunde pro Tag',
            dailyDarkMatter: 'DM-Funde pro Tag',
            dailyDarkMatterSizes: 'Größen der DM-Funde pro Tag',
        },
        combats: {
            header: 'Kämpfe',
            rawData: 'Rohdaten (jedes einzelne Kampfergebnis)',
            dailyResults: 'Kampfergebnisse pro Tag',
            dailyLoot: 'Beutebilanz pro Tag',
            dailyLostShips: 'Verlorene Schiffe pro Tag',
        },
        debrisFields: {
            header: 'Trümmerfelder',
            rawData: 'Rohdaten (jeder einzelne getrackte TF-Abbaubericht)',
            dailyResources: 'Abgebaute Rohstoffe pro Tag',
        },
        lifeformDiscoveries: {
            header: 'Entdeckungsmissionen',
            rawData: 'Rohdaten (jede einzelne getrackte Mission)',
            dailyExperience: 'Gesammelte Erfahrung pro Tag',
        },
    },
    generateButton: 'Excel-Export generieren',

    expeditions: {
        prefix: 'EX',

        sheets: {
            rawData: 'Rohdaten',
            dailyDepletion: 'Tägliche Systemauslastung',
            dailyResults: 'Tägliche Ergebnisse',
            dailyResources: 'Tägliche Rohstoffe',
            dailyShips: 'Tägliche Schiffe',
            dailyDarkMatter: 'Tägliche Dunkle Materie',
        },

        eventType: 'Typ',
        eventSize: 'Größe',
        item: 'Item',
    },
    combats: {
        prefix: 'KB',

        sheets: {
            rawData: 'Rohdaten',
            dailyResults: 'Tägliche Ergebnisse',
            dailyLoot: 'Tägliche Beute',
            dailyLostShips: 'Täglich verlorene Schiffe',
        },

        result: 'Kampfergebnis',
        coordinates: 'Koordinaten',
        galaxy: 'Galaxie',
        system: 'System',
        position: 'Position',
        targetType: 'Zieltyp',
        combatType: 'Kampftyp',
        expeditionCombatOpponent: 'Expeditionskampfgegner',
        loot: 'Beute',
        lostShips: 'Verlorene Schiffe',
        debrisField: 'Trümmerfeld',
        moon: 'Mond',
        planet: 'Planet',
        expeditionCombat: 'Expeditionskampf',
        playerCombat: 'Spielerkampf',
        pirates: 'Piraten',
        aliens: 'Aliens',

        againstPlayers: 'Gegen Spieler',
        onExpeditions: 'Auf Expeditionen',
    },
    debrisFields: {
        prefix: 'TF',

        sheets: {
            rawData: 'Rohdaten',
            dailyResources: 'Tägliche Rohstoffe',
        },
    },
    lifeformDiscoveries: {
        prefix: 'LF',

        sheets:{
            rawData: 'Rohdaten',
            dailyExperience: 'Tägliche Erfahrung',
        },
    },
};