import { AboutTranslations } from "./type";

export const de: AboutTranslations = {
    faqHelp: {
        header: 'Hilfe',
        faq: {
            header: 'F.A.Q.',
            fleetLostOnExpedition: {
                header: 'Warum werden deine Schiffe nicht getrackt, die du auf Expeditionen verloren hast?',
                text: 'Das Tracking verlorener Schiffe erfordert dauerhaftes Flottentracking, was nicht möglich ist.',
            },
            syncBetweenDevices: {
                header: 'Warum werden deine Daten nicht auf mehreren Geräten synchronisiert?',
                text: 'Die Menge der vom Tracker erfassten Daten übersteigt die Größe der Daten, die über deinen Nutzeraccount (Google, Microsoft, o.ä.) synchronisiert werden können. Eine Synchronisierung über einen externen Server wird eventuell in der Zukunft möglich sein.',
            },
            productionInResourceBalance: {
                header: 'Warum wird deine Rohstoffproduktion nicht in der Rohstoffbilanz berücksichtigt?',
                text: 'Die Rohstoffproduktion hängt von vielen Faktoren ab, deren Änderungen dauerhaft getrackt werden müssten. Dies ist zwar möglich, jedoch übersteigt die Komplexität dieses Features die des zusätzlichen Nutzens.',
            },
            whatAreAverages: {
                header: 'Was bedeutet \'⌀ pro Tag\'?',
                text: 'Dies ist der Durchschnitt über alle Tage mit mindestens einem getrackten Ereignis.',
            },
        },
        tips: {
            header: 'Tipps',
            rightClickDefaultRoute: 'Du kannst einen der linken Tabs im Hauptmenü sowie untergeordnete Menüs rechtsklicken, um dieses (Unter-)Menü als Standardmenü für die gewählte Route auszuwählen.',
            numbersKeyboardNavigation: 'Die mit Ziffern versehenen Tabs können auch über die Tastatur geöffnet werden, indem man die passende Zifferntaste drückt.',
            amortizationTable: {
                part1: 'Du möchtest wissen, was du als nächstes bauen oder forschen solltest, um deine Produktion möglichst effizient zu erhöhen? Probiere den\xa0',
                name: 'interaktiven Amortisationsrechner',
                part2: '.',
            },
            inlineSettings: 'Du kannst dazugehörige Einstellungen direkt ändern, indem du auf einer passenden Seite das kleine Zahnrad-Icon auf dem rechten Seite klickst.',
            switchAccountHtml: 'Du kannst das Interface des OGame Trackers für einen anderen getrackten Accounts ansehen, indem du im Menü das Icon <span class="mdi mdi-account-multiple"></span> klickst und den passenden Account wählst.',
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
                numberOfTrackedLifeformDiscoveries: 'Anzahl getrackter Entdeckungsmissionen',
                lastUpdateServerSettings: 'Letzte Aktualisierung der Serverinformationen',
                numberOfUniverseHistoryEntries: 'Anzahl Einträge in Universumshistorie',
            },
            global: {
                header: 'Informationen über alle Daten im OGame Tracker',
                numberOfTrackedAccounts: 'Anzahl getrackter Accounts',
                estimatedSize: 'Größe aller gespeichtern Daten',
            },
        },
    },
};