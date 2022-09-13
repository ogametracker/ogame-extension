import { AboutTranslations } from "./type";

export const en: AboutTranslations = {
    faqHelp: {
        header: 'Help',
        faq: {
            header: 'F.A.Q.',
            fleetLostOnExpedition: {
                header: 'Why are the ships not tracked that I lost on expeditions?',
                text: 'Tracking lost ships on expeditions requires permanent fleet tracking which is not feasible.',
            },
            syncBetweenDevices: {
                header: 'Why is there no synchronization of my data between multiple devices?',
                text: 'The tracker saves a lot more data than can be synchronized using your user account (Google, Microsoft, etc). A synchronization with an external server might be possible in the future.',
            },
            productionInResourceBalance: {
                header: 'Why does the resource balance not include my resource production?',
                text: 'Your resource production depends on various factors, and their changes would have to be tracked permanently. While this is possible, an implementation of this feature would be much more complex than it would be of use for its users.',
            },
            whatAreAverages: {
                header: 'What does the \'⌀ per day\' mean?',
                text: 'This is the average over all days with at least one tracked event.',
            },
        },
        tips: {
            header: 'Tips',
            rightClickDefaultRoute: 'You can right-click a main tab on the left side or any of its sub-menu items to set this menu as standard for the selected route.',
            numbersKeyboardNavigation: 'You can open the pages of the tabs with a digit by pressing the respective digit key on your keyboard.',
            amortizationTable: {
                part1: 'Want to know what to build or research next to improve your resource production the most efficient way? Try the\xa0',
                name: 'interactive amortization calculator',
                part2: '.',
            },
            inlineSettings: 'You can change related settings immediately by pressing the small gear icon on the right side.',
            switchAccountHtml: 'You can open the OGame Tracker interface for another tracked account by clicking the <span class="mdi mdi-account-multiple"></span> icon and selecting the account.',
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
                numberOfTrackedLifeformDiscoveries: 'Number of tracked discovery missiongs',
                lastUpdateServerSettings: 'Latest server settings update',
                numberOfUniverseHistoryEntries: 'Number of entries in universe history',
            },
            global: {
                header: 'Information about all data in the OGame Tracker',
                numberOfTrackedAccounts: 'Number of tracked accounts',
                estimatedSize: 'Size of all saved data on disk',
            },
        },
    },
};