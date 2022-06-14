export interface SettingsTranslations {
    tabs: {
        dateRanges: string;
        colors: string;
        misc: string;
        importExport: string;
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
    misc: {
        msuConversionRates: string;
        resourceUnitFactorsOfShipFoundOnExpeditions: string;
        resourceUnitFactorsOfLostShips: string;
        detailedResourceBalance: {
            header: string;
            checkboxLabel: string;
        };
        extensionLanguage: string;
    };
    reset: string;
    setDefaultRoute: string;
    setDefaultSubRoute: string;
}