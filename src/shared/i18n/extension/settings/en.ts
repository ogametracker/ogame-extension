import { SettingsTranslations } from "./type";

export const en: SettingsTranslations = {
    tabs: {
        dateRanges: 'Date Ranges',
        colors: 'Colors',
        common: 'Common',
        importExport: 'Import/Export',
        expeditions: 'Expeditions',
        combats: 'Combats',
        debrisFields: 'Debris Fields',
        resourceBalance: 'Resource Balance',
        universeHistory: 'Universe History',
        dangerZone: 'Danger Zone',
        accessbility: 'Accessibility',

        migrateOldData: 'Migrate old data',
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
        expeditionDepletionLevels: 'System Depletion',
        lifeformDiscoveries: 'Lifeform discovery events',
        lifeforms: 'Lifeforms',
        resources: 'Resources',
        ships: 'Ships',
    },
    common: {
        conversionRates: {
            title: 'Conversion rates',
            msuLong: 'Convert to Metal',
            dsuLong: 'Convert to Deuterium',
        },
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
            checkboxLabel: 'Show detailed resource balance',
        },
        includeShipsFoundOnExpeditions: {
            header: 'Ships found in expeditions',
            checkboxLabel: 'Include resources of ships found on expeditions in resource balance',
        },
        includeShipsLostInCombats: {
            header: 'Ships lost in combats',
            checkboxLabel: 'Include resources of ships lost in combats in resource balance',
        },
    },
    showConvertedUnitsInTables: {
        title: 'MSU/DSU in tables',
        label: 'Show converted MSU/DSU values in tables',

        infoAmortization: 'Amortization time will still be calculated using cost and production in MSU/DSU',
    },

    reset: 'Reset settings',
    setDefaultRoute: 'Set as default',
    setDefaultSubRoute: 'Set as default for this area',

    dangerZone: {
        doYouWantToContinue: 'ARE YOU SURE YOU WANT TO CONTINUE?',

        deleteExpeditions: {
            button: (account: string) => `Delete all tracked expeditions for the currently selected account (${account})`,
            confirmationText: (account: string, count: string) => `If you confirm, all ${count} tracked expeditions will be deleted for the currently selected account (${account}).`,
        },
        deleteCombats: {
            button: (account: string) => `Delete all tracked combats for the currently selected account (${account})`,
            confirmationText: (account: string, count: string) => `If you confirm, all ${count} tracked combats will be deleted for the currently selected account (${account}).`,
        },
        deleteDebrisFieldReports: {
            button: (account: string) => `Delete all tracked debris field harvest reports for the currently selected account (${account})`,
            confirmationText: (account: string, count: string) => `If you confirm, all ${count} tracked debris field harvest reports will be deleted for the currently selected account (${account}).`,
        },
        deleteAccount: {
            button: (account: string) => `Delete all data of the currently selected account (${account})`,
            confirmationText: (account: string) => `If you confirm, all tracked data for the currently selected account (${account}) will be deleted.\n`
                + `This includes tracked universe history data if there is no other account tracked for this universe.`,
        },
        deleteUniverseHistory: {
            button: (server: string) => `Delete tracked universe history of currently selected universe (${server})`,
            confirmationText: (server: string) => `If you confirm, all tracked universe history data for the currently selected universe (${server}) will be deleted.`,
        },
        deleteEverything: {
            button: 'Delete all data',
            confirmationText1: `If you confirm, all data will be deleted.\n`
                + 'This includes tracked data of every account including tracked expeditions, combats, debris field reports, universe history data, and more.',
            confirmationText2: 'Please confirm again that you want to delete all data.',
        },
    },

    importExport: {
        export: {
            header: 'Export',
            description: 'Here you can export your data. This will include relevant data of all your tracked accounts and their servers.',
            includeUniverseHistory: 'include universe history in export (this may greatly increase file size and import time!)',
            button: 'Start export',
            wait: 'Please wait while your data is being prepared for the export...',

            errors: {
                unexpectedError: 'An unexpected error occured while exporting your data.',
            },
        },
        import: {
            header: 'Import',
            description: 'Here you can import your data from a file. Please select your file.',
            button: 'Start import',
            wait: 'Please wait while your data is being imported...',

            errors: {
                invalidFormat: 'The file format is invalid.',
                unexpectedError: 'An unexpected error occured while importing your data.',
            },
        },

        importCallbacks: {
            importingSettings: 'Importing your settings',
            importingBasicData: 'Importing basic account and server data',
            importingAccounts: 'Importing accounts',
            importingUniverseHistories: 'Importing server universe history',
        },
    },
    accessibility: {
        showSimplifiedResults: {
            title: 'Simplified visualization',
            label: 'Simplified visualization, hides original messages of expedition results and DF harvest reports, and shows icons instead of texts in notifications.',
        },
    },

    debrisFields: {
        separateExpeditionDebrisFields: {
            title: 'Separate position 16',
            label: 'Separate debris fields harvested at position 16 from position 1-15',
        },
    },
};