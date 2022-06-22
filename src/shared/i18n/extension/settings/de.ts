import { SettingsTranslations } from "./type";

export const de: SettingsTranslations = {
    tabs: {
        dateRanges: 'Datumsbereiche',
        colors: 'Farben',
        common: 'Allgemein',
        importExport: 'Import/Export',
        expeditions: 'Expeditionen',
        combats: 'Kämpfe',
        resourceBalance: 'Rohstoffbilanz',
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
        resources: 'Rohstoffe',
        ships: 'Schiffe',
    },
    common: {
        extensionLanguage: 'UI-Sprache (im OGame Tracker)',
        msuConversionRates: 'MSE-Umrechnungskurse',
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
    },
    reset: 'Einstellungen zurücksetzen',
    setDefaultRoute: 'als Standardauswahl festlegen',
    setDefaultSubRoute: 'als Standardauswahl für diesen Bereich auswählen',
};