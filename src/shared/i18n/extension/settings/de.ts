import { SettingsTranslations } from "./type";

export const de: SettingsTranslations = {
    tabs: {
        dateRanges: 'Datumsbereiche',
        colors: 'Farben',
        common: 'Allgemein',
        importExport: 'Import/Export',
        expeditions: 'Expeditionen',
        combats: 'Kämpfe',
        debrisFields: 'Trümmerfelder',
        resourceBalance: 'Rohstoffbilanz',
        universeHistory: 'Universumshistorie',
        dangerZone: 'Gefahrenzone',
        accessbility: 'Barrierefreiheit',

        migrateOldData: 'Altdaten migrieren',
    },
    dateRanges: {
        defaultNames: {
            today: 'Heute',
            yesterday: 'Gestern',
            currentWeek: 'Aktuelle Woche',
            lastWeek: 'Letzte Woche',
            currentMonth: 'Aktueller Monat',
            newRange: 'Neuer Bereich',
        },
        since: (date) => `Seit ${date}`,
        firstDayTemplate: '<erster Tag>',
        headers: {
            label: 'Benennung',
            type: 'Typ',
            rangeStart: 'Bereich startet vor',
            rangeContains: 'Bereich enthält',
        },
        day: 'Tag',
        days: 'Tag',
        daysAgo: 'Tagen',
        week: 'Woche',
        weeks: 'Wochen',
        weeksAgo: 'Wochen',
        month: 'Monat',
        months: 'Monate',
        monthsAgo: 'Monaten',
        year: 'Jahr',
        years: 'Jahre',
        yearsAgo: 'Jahren',
    },
    colors: {
        combatResults: 'Kampfergebnis',
        expeditionEvents: 'Expeditionsereignisse',
        expeditionEventSizes: 'Ereignisgrößen',
        expeditionDepletionLevels: 'Systemauslastung',
        lifeformDiscoveries: 'Ereignisse Lebensformentdeckungen',
        lifeforms: 'Lebensformen',
        resources: 'Rohstoffe',
        ships: 'Schiffe',
    },
    common: {
        extensionLanguage: 'UI-Sprache (im OGame Tracker)',
        conversionRates: {
            title: 'Umrechnungskurse',
            msuLong: 'Umrechnung nach Metall',
            dsuLong: 'Umrechnung nach Deuterium',
        },
    },
    expeditions: {
        resourceUnitFactorsOfShipFoundOnExpeditions: 'Faktoren der Rohstoffeinheiten auf Expeditionen gefundener Schiffe',
    },
    combats: {
        resourceUnitFactorsOfLostShips: 'Faktoren der Rohstoffeinheiten in Kämpfen verlorener Schiffe',
        ignoreEspionageCombats: {
            title: 'Spionagekämpfe ignorieren',
            label: 'Spionage-Kampfberichte für das Tracking ignorieren',
        },
    },
    resourceBalance: {
        detailedResourceBalance: {
            header: 'Detaillierte Rohstoffbilanz',
            checkboxLabel: 'detaillierte Anzeige der Rohstoffbilanz',
        },
        includeShipsFoundOnExpeditions: {
            header: 'Auf Expeditionen gefundene Schiffe',
            checkboxLabel: 'Rohstoffeinheiten auf Expeditionen gefundener Schiffe in die Rohstoffbilanz einbeziehen',
        },
        includeShipsLostInCombats: {
            header: 'In Kämpfen verlorene Schiffe',
            checkboxLabel: 'Rohstoffeinheiten in Kämpfen verlorener Schiffe in die Rohstoffbilanz einbeziehen',
        },
    },
    showConvertedUnitsInTables: {
        title: 'MSE/DSE in Tabellen',
        label: 'Umgerechnete MSE/DSE-Werte in Tabellen anzeigen',

        infoAmortization: 'Amotisationszeit wird weiterhin anhand von Kosten und Produktion in MSE/DSE errechnet',
    },

    reset: 'Einstellungen zurücksetzen',
    setDefaultRoute: 'als Standardauswahl festlegen',
    setDefaultSubRoute: 'als Standardauswahl für diesen Bereich auswählen',

    dangerZone: {
        doYouWantToContinue: 'BIST DU SICHER, DASS DU FORTFAHREN WILLST?',

        deleteExpeditions: {
            button: (account: string) => `Alle getrackten Expeditionen des aktuell gewählten Accounts (${account}) entfernen`,
            confirmationText: (account: string, count: string) => `Nach dem Bestätigen dieser Aktion werden alle ${count} getrackten Expeditionen des aktuell gewählten Accounts (${account}) gelöscht.`,
        },
        deleteCombats: {
            button: (account: string) => `Alle getrackten Kämpfe des aktuell gewählten Accounts (${account}) entfernen`,
            confirmationText: (account: string, count: string) => `Nach dem Bestätigen dieser Aktion werden alle ${count} getrackten Kämpfe des aktuell gewählten Accounts (${account}) gelöscht.`,
        },
        deleteDebrisFieldReports: {
            button: (account: string) => `Alle getrackten TF-Abbauberichte des aktuell gewählten Accounts (${account}) entfernen`,
            confirmationText: (account: string, count: string) => `Nach dem Bestätigen dieser Aktion werden alle ${count} getrackten TF-Abbauberichte des aktuell gewählten Accounts (${account}) gelöscht.`,
        },
        deleteAccount: {
            button: (account: string) => `Alle Daten des aktuell gewählten Accounts (${account}) entfernen`,
            confirmationText: (account: string) => `Nach dem Bestätigen dieser Aktion werden alle gespeicherten Daten des aktuell gewählten Accounts (${account}) gelöscht.\n`
                + `Dies beinhaltet die getrackte Universumshistorie dieses Servers sofern kein anderer Account für diesen Server getrackt ist.`,
        },
        deleteUniverseHistory: {
            button: (server: string) => `Universumshistorie des aktuell gewählten Universums (${server}) entfernen`,
            confirmationText: (server: string) => `Nach dem Bestätigen dieser Aktion werden alle getrackten Daten zur Universumshistorie des aktuell gewählten Universums (${server}) gelöscht.`,
        },
        deleteEverything: {
            button: 'Alle Daten entfernen',
            confirmationText1: `Nach dem Bestätigen dieser Aktion werden alle Daten gelöscht.\n`
                + 'Das heißt, alle Daten inklusive getrackter Expeditionen, Kämpfe, TF-Abbauberichte, Universumshistorie und mehr, werden entfernt.',
            confirmationText2: 'Bitte bestätige erneut, dass du alle Daten löschen möchtest.',
        },
    },

    importExport: {
        export: {
            header: 'Export',
            description: 'Hier kannst du deine Daten exportieren. Der Export enthält alle relevanten Daten deiner getrackten Accounts und dazugehörigen Servern.',
            includeUniverseHistory: 'auch Universumshistorie exportieren (kann die Dateigröße und Importzeit deutlich erhöhen!)',
            button: 'Export starten',
            wait: 'Bitte warte während deine Daten für den Export vorbereitet werden...',

            errors: {
                unexpectedError: 'Ein unerwarteter Fehler ist während des Exports aufgetreten.',
            },
        },
        import: {
            header: 'Import',
            description: 'Hier kannst du deine Daten aus einer Datei importieren. Bitte wähle die Importdatei.',
            button: 'Import starten',
            wait: 'Bitte warte während deine Daten importiert werden...',

            errors: {
                invalidFormat: 'Das Dateiformat ist ungültig.',
                unexpectedError: 'Ein unerwarteter Fehler ist während des Imports aufgetreten.',
            },
        },

        importCallbacks: {
            importingSettings: 'Einstellungen werden imporiert',
            importingBasicData: 'Grundlegende Account- und Server-Informationen werden importiert',
            importingAccounts: 'Accounts werden importiert',
            importingUniverseHistories: 'Universumshistorien werden importiert',
        },
    },
    accessibility: {
        showSimplifiedResults: {
            title: 'Vereinfachte Ansicht',
            label: 'Vereinfachte Ansicht, versteckt Originaltexte von Expeditionsergebnissen und TF-Abbauberichten, und zeigt Icons anstatt Texten in den Benachrichtigungen.',
        },
    },

    debrisFields: {
        separateExpeditionDebrisFields: {
            title: 'TFs von Position 16 separat anzeigen',
            label: 'TFs von Position 16 separat anzeigen',
        },
    },
};