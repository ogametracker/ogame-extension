export interface AboutTranslations {
    faqHelp: {
        header: string;
        faq: {
            header: string;   
            fleetLostOnExpedition: {
                header: string;
                text: string;
            };
            syncBetweenDevices: {
                header: string;
                text: string;
            };
            productionInResourceBalance: {
                header: string;
                text: string;
            };
            whatAreAverages: {
                header: string;
                text: string;
            };
        };
        tips: {
            header: string;
            rightClickDefaultRoute: string;
            numbersKeyboardNavigation: string;
            amortizationTable: {
                part1: string;
                name: string;
                part2: string;
            };
            inlineSettings: string;
            switchAccountHtml: string;
        };

        messageDiscord: {
            part1: string;
            discordServer: string;
            part2: string;
        };
    };
    info: {
        header: string;
        table: {
            currentAccount: {
                header: string;
                numberOfTrackedExpeditions: string;
                numberOfTrackedCombatReports: string;
                numberOfTrackedDebrisFieldReports: string;
                lastUpdateServerSettings: string;
                numberOfUniverseHistoryEntries: string;
            };

            global: {
                header: string;
                numberOfTrackedAccounts: string;
                estimatedSize: string;
            };
        };
    };
}