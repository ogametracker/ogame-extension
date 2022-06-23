import { SettingsTranslations } from "./type";

export const en: SettingsTranslations = {
    tabs: {
        dateRanges: 'Date Ranges',
        colors: 'Colors',
        common: 'Common',
        importExport: 'Import/Export',
        expeditions: 'Expeditions',
        combats: 'Combats',
        resourceBalance: 'Resource Balance',
        universeHistory: 'Universe History',
    },
    dateRanges: {
        defaultNames: {
            today: 'Today',
            yesterday: 'Yesterday',
            currentWeek: 'Current week',
            lastWeek: 'Last week',
            currentMonth: 'Current month',
            newRange: 'new range',
        },
        since: (date) => `Since ${date}`,
        firstDayTemplate: '<first day>',
        headers: {
            label: 'Label',
            type: 'Type',
            rangeStart: 'Range starts',
            rangeContains: 'Range contains',
        },
        day: 'day',
        days: 'days',
        daysAgo: 'days ago',
        week: 'week',
        weeks: 'weeks',
        weeksAgo: 'weeks ago',
        month: 'month',
        months: 'months',
        monthsAgo: 'months ago',
        year: 'year',
        years: 'years',
        yearsAgo: 'years ago',
    },
    colors: {
        combatResults: 'Combat results',
        expeditionEvents: 'Expedition events',
        expeditionEventSizes: 'Expedition event sizes',
        resources: 'Resources',
        ships: 'Ships',
    },
    common: {
        msuConversionRates: 'MSU conversion rates',
        extensionLanguage: 'UI language (within OGame Tracker)',
    },
    expeditions: {
        resourceUnitFactorsOfShipFoundOnExpeditions: 'Factors of resource units of ships found on expeditions',
    },
    combats: {
        resourceUnitFactorsOfLostShips: 'Factor of resource units of ships lost in combat',
        ignoreEspionageCombats: {
            title: 'Ignore espionage combats',
            label: 'Ignore espionage combat reports for combat tracking',
        },
    },
    resourceBalance: {
        detailedResourceBalance: {
            header: 'Detailed resource balance',
            checkboxLabel: 'show detailed resource balance',
        },
    },
    reset: 'Reset settings',
    setDefaultRoute: 'Set as default',
    setDefaultSubRoute: 'Set as default for this area',
};