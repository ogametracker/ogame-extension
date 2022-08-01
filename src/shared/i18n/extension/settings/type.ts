export interface SettingsTranslations {
    tabs: {
        dateRanges: string;
        colors: string;
        common: string;
        importExport: string;
        expeditions: string;
        combats: string;
        debrisFields: string;
        resourceBalance: string;
        universeHistory: string;
        dangerZone: string;
        accessbility: string;

        migrateOldData: string;
    };
    dateRanges: {
        defaultNames: {
            today: string;
            yesterday: string;
            currentWeek: string;
            lastWeek: string;
            currentMonth: string;
            newRange: string;
        };
        since(date: string): string;
        firstDayTemplate: string;
        headers: {
            label: string;
            type: string;
            rangeStart: string;
            rangeContains: string;
        };
        day: string;
        days: string;
        daysAgo: string;
        week: string;
        weeks: string;
        weeksAgo: string;
        month: string;
        months: string;
        monthsAgo: string;
        year: string;
        years: string;
        yearsAgo: string;
    };
    colors: {
        expeditionEvents: string;
        expeditionEventSizes: string;
        combatResults: string;
        resources: string;
        ships: string;
    };
    common: {
        msuConversionRates: string;
        extensionLanguage: string;
    };
    expeditions: {
        resourceUnitFactorsOfShipFoundOnExpeditions: string;
    };
    combats: {
        resourceUnitFactorsOfLostShips: string;
        ignoreEspionageCombats: {
            title: string;
            label: string;
        };
    };
    resourceBalance: {
        detailedResourceBalance: {
            header: string;
            checkboxLabel: string;
        };
        includeShipsFoundOnExpeditions: {
            header: string;
            checkboxLabel: string;
        };
        includeShipsLostInCombats: {
            header: string;
            checkboxLabel: string;
        };
    };
    showMsuInTables: {
        title: string;
        label: string;

        infoAmortization: string;
    };

    reset: string;
    setDefaultRoute: string;
    setDefaultSubRoute: string;

    dangerZone: {
        doYouWantToContinue: string;

        deleteExpeditions: {
            button: (account: string) => string;
            confirmationText: (account: string, count: string) => string;
        };
        deleteCombats: {
            button: (account: string) => string;
            confirmationText: (account: string, count: string) => string;
        };
        deleteDebrisFieldReports: {
            button: (account: string) => string;
            confirmationText: (account: string, count: string) => string;
        };
        deleteAccount: {
            button: (account: string) => string;
            confirmationText: (account: string) => string;
        };
        deleteUniverseHistory: {
            button: (server: string) => string;
            confirmationText: (server: string) => string;
        };
        deleteEverything: {
            button: string;
            confirmationText1: string;
            confirmationText2: string;
        };
    };

    importExport: {
        export: {
            header: string;
            description: string;
            includeUniverseHistory: string;
            button: string;
            wait: string;

            errors: {
                unexpectedError: string;
            };
        };
        import: {
            header: string;
            description: string;
            button: string;
            wait: string;

            errors: {
                invalidFormat: string;
                unexpectedError: string;
            };
        };

        importCallbacks: {
            importingSettings: string;
            importingBasicData: string;
            importingAccounts: string;
            importingUniverseHistories: string;
        };
    };

    accessibility: {
        showSimplifiedResults: {
            title: string;
            label: string;
        };
    };

    debrisFields: {
        separateExpeditionDebrisFields: {
            title: string;
            label: string;
        };
    };
}