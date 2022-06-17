import { AboutTranslations } from "./type";

export const de: AboutTranslations = {
    faqHelp: {
        header: 'Hilfe',
        faq: {
            header: 'F.A.Q.',
            fleetLostOnExpedition: {
                header: 'Warum werden deine Schiffe nicht getrackt, die du auf Expeditionen verloren hast?',
                text: 'TODO:',
            },
            syncBetweenDevices: {
                header: 'Warum werden deine Daten nicht auf mehreren Geräten synchronisiert?',
                text: 'TODO:',
            },
            productionInResourceBalance: {
                header: 'Warum wird deine Rohstoffproduktion nicht in der Rohstoffbilanz berücksichtigt?',
                text: 'TODO:',
            },
        },
        tips: {
            header: 'Tipps',
            rightClickDefaultRoute: 'TODO: Right click route',
            numbersKeyboardNavigation: 'TODO: Keyboard numbers navigation',
            amortizationTable: {
                part1: 'Du möchtest wissen, was du als nächstes bauen oder forschen solltest, um deine Produktion möglichst effizient zu erhöhen? Probiere den\xa0',
                name: 'interaktiven Amortisationsrechner',
                part2: '.',
            },
            inlineSettings: 'TODO: Inline settings',
            switchAccount: 'TODO: Switch account',
        },

        messageDiscord: {
            part1: 'Du brauchst Hilfe, hast einen Bug gefunden, oder hast eine Feature-Anfrage? Tritt dem\xa0',
            discordServer: 'Discord-Server',
            part2: '\xa0bei und schreibe eine Nachricht im passenden Channel.',
        },
    },
    info: {
        header: 'Info',
        table: {
            currentAccount: {
                header: 'Informationen über den ausgewählten Account',
                numberOfTrackedExpeditions: 'Anzahl getrackter Expeditionen',
                numberOfTrackedCombatReports: 'Anzahl getrackter Kämpfe',
                numberOfTrackedDebrisFieldReports: 'Anzahl getrackter TF-Abbauberichte',
                lastUpdateServerSettings: 'Letzte Aktualisierung der Serverinformationen',
                numberOfUniverseHistoryEntries: 'Anzahl Einträge in Universumshistorie',
            },
            global: {
                header: 'Informationen über alle Daten im OGame Tracker',
                numberOfTrackedAccounts: 'Anzahl getrackter Accounts',
                estimatedSize: 'ungefähre Größe aller gespeichtern Daten',
            },
        },
    },
};