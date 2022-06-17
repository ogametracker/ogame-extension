import { AboutTranslations } from "./type";

export const en: AboutTranslations = {
    faqHelp: {
        header: 'Help',
        faq: {
            header: 'F.A.Q.',
            fleetLostOnExpedition: {
                header: 'Why are the ships not tracked that I lost on expeditions?',
                text: 'TODO:',
            },
            syncBetweenDevices: {
                header: 'Why is there no synchronization of my data between multiple devices?',
                text: 'TODO:',
            },
            productionInResourceBalance: {
                header: 'Why does the resource balance not include my resource production?',
                text: 'TODO:',
            },
        },
        tips: {
            header: 'Tipps',
            rightClickDefaultRoute: 'TODO: Right click route',
            numbersKeyboardNavigation: 'TODO: Keyboard numbers navigation',
            amortizationTable: {
                part1: 'Want to know what to build or research next to improve your resource production the most efficient way? Try the\xa0',
                name: 'interactive amortization calculator',
                part2: '.',
            },
            inlineSettings: 'TODO: Inline settings',
            switchAccount: 'TODO: Switch account',
        },

        messageDiscord: {
            part1: 'Need help, found a bug, or have a feature request? Join the\xa0',
            discordServer: 'Discord server',
            part2: '\xa0and write a message in the related channel.',
        },
    },
    info: {
        header: 'Info',
        table: {
            currentAccount: {
                header: 'Information about the selected account',
                numberOfTrackedExpeditions: 'Number of tracked expeditions',
                numberOfTrackedCombatReports: 'Number of tracked combat reports',
                numberOfTrackedDebrisFieldReports: 'Number of tracked harvest reports',
                lastUpdateServerSettings: 'Latest server settings update',
                numberOfUniverseHistoryEntries: 'Number of entries in universe history',
            },
            global: {
                header: 'Information about all data in the OGame Tracker',
                numberOfTrackedAccounts: 'Number of tracked accounts',
                estimatedSize: 'Estimated size of all saved data',
            },
        },
    },
};