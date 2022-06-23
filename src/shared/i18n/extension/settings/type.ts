export interface SettingsTranslations {
    tabs: {
        dateRanges: string;
        colors: string;
        common: string;
        importExport: string;
        expeditions: string;
        combats: string;
        resourceBalance: string;
        universeHistory: string;
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
    };
    reset: string;
    setDefaultRoute: string;
    setDefaultSubRoute: string;
}