import { SettingsTranslations } from "./type";

export const de: SettingsTranslations = {
    tabs: {
        dateRanges: 'Datumsbereiche',
        colors: 'Farben',
        common: 'Allgemein',
        importExport: 'Import/Export',
        expeditions: 'Expeditionen',
        combats: 'Kämpfe',
        debrisFields: 'Trümmerfelder',
        resourceBalance: 'Rohstoffbilanz',
        universeHistory: 'Universumshistorie',
        dangerZone: 'Gefahrenzone',
        accessbility: 'Barrierefreiheit',
        linkAccounts: 'Accounts verknüpfen',

        migrateOldData: 'Altdaten migrieren',
    },
    dateRanges: {
        defaultNames: {
            today: 'Heute',
            yesterday: 'Gestern',
            currentWeek: 'Aktuelle Woche',
            lastWeek: 'Letzte Woche',
            currentMonth: 'Aktueller Monat',
            newRange: 'Neuer Bereich',
        },
        since: (date) => `Seit ${date}`,
        firstDayTemplate: '<erster Tag>',
        headers: {
            label: 'Benennung',
            type: 'Typ',
            rangeStart: 'Bereich startet vor',
            rangeContains: 'Bereich enthält',
        },
        day: 'Tag',
        days: 'Tag',
        daysAgo: 'Tagen',
        week: 'Woche',
        weeks: 'Wochen',
        weeksAgo: 'Wochen',
        month: 'Monat',
        months: 'Monate',
        monthsAgo: 'Monaten',
        year: 'Jahr',
        years: 'Jahre',
        yearsAgo: 'Jahren',
    },
    colors: {
        combatResults: 'Kampfergebnis',
        expeditionEvents: 'Expeditionsereignisse',
        expeditionEventSizes: 'Ereignisgrößen',
        expeditionDepletionLevels: 'Systemauslastung',
        lifeformDiscoveries: 'Entdeckungsmissionen',
        lifeforms: 'Lebensformen',
        resources: 'Rohstoffe',
        ships: 'Schiffe',
    },
    common: {
        extensionLanguage: 'UI-Sprache (im OGame Tracker)',
        extensionLanguageFallbackHint: 'Sollten Texte nicht in der gewählten Sprache verfügbar sein, werden englische Texte angezeigt.',
        conversionRates: {
            title: 'Umrechnungskurse',
            msuLong: 'Umrechnung nach Metall',
            dsuLong: 'Umrechnung nach Deuterium',
        },

        serverSettings: {
            title: 'Serverdaten',
            lastUpdate: 'Letzte Aktualisierung',
            forceUpdate: 'Serverdaten aktualisieren',
        },
    },
    expeditions: {
        resourceUnitFactorsOfShipFoundOnExpeditions: 'Faktoren der Rohstoffeinheiten auf Expeditionen gefundener Schiffe',
    },
    combats: {
        resourceUnitFactorsOfLostShips: 'Faktoren der Rohstoffeinheiten in Kämpfen verlorener Schiffe',
        ignoreEspionageCombats: {
            title: 'Spionagekämpfe ignorieren',
            label: 'Spionage-Kampfberichte für das Tracking ignorieren',
        },
    },
    resourceBalance: {
        detailedResourceBalance: {
            header: 'Detaillierte Rohstoffbilanz',
            checkboxLabel: 'detaillierte Anzeige der Rohstoffbilanz',
        },
        includeShipsFoundOnExpeditions: {
            header: 'Auf Expeditionen gefundene Schiffe',
            checkboxLabel: 'Rohstoffeinheiten auf Expeditionen gefundener Schiffe in die Rohstoffbilanz einbeziehen',
        },
        includeShipsLostInCombats: {
            header: 'In Kämpfen verlorene Schiffe',
            checkboxLabel: 'Rohstoffeinheiten in Kämpfen verlorener Schiffe in die Rohstoffbilanz einbeziehen',
        },
        includeLostLootResources: {
            header: 'In Kämpfen verlorene Rohstoffe',
            checkboxLabel: 'in Kämpfen verlorene Rohstoffeinheiten in die Rohstoffbilanz einbeziehen',
        },
    },
    showConvertedUnitsInTables: {
        title: 'MSE/DSE in Tabellen',
        label: 'Umgerechnete MSE/DSE-Werte in Tabellen anzeigen',

        infoAmortization: 'Amotisationszeit wird weiterhin anhand von Kosten und Produktion in MSE/DSE errechnet',
    },

    reset: 'Einstellungen zurücksetzen',
    setDefaultRoute: 'als Standardauswahl festlegen',
    setDefaultSubRoute: 'als Standardauswahl für diesen Bereich auswählen',

    dangerZone: {
        doYouWantToContinue: 'BIST DU SICHER, DASS DU FORTFAHREN WILLST?',

        deleteExpeditions: {
            button: (account: string) => `Alle getrackten Expeditionen des aktuell gewählten Accounts (${account}) entfernen`,
            confirmationText: (account: string, count: string) => `Nach dem Bestätigen dieser Aktion werden alle ${count} getrackten Expeditionen des aktuell gewählten Accounts (${account}) gelöscht.`,
        },
        deleteCombats: {
            button: (account: string) => `Alle getrackten Kämpfe des aktuell gewählten Accounts (${account}) entfernen`,
            confirmationText: (account: string, count: string) => `Nach dem Bestätigen dieser Aktion werden alle ${count} getrackten Kämpfe des aktuell gewählten Accounts (${account}) gelöscht.`,
        },
        deleteDebrisFieldReports: {
            button: (account: string) => `Alle getrackten TF-Abbauberichte des aktuell gewählten Accounts (${account}) entfernen`,
            confirmationText: (account: string, count: string) => `Nach dem Bestätigen dieser Aktion werden alle ${count} getrackten TF-Abbauberichte des aktuell gewählten Accounts (${account}) gelöscht.`,
        },
        deleteAccount: {
            button: (account: string) => `Alle Daten des aktuell gewählten Accounts (${account}) entfernen`,
            confirmationText: (account: string) => `Nach dem Bestätigen dieser Aktion werden alle gespeicherten Daten des aktuell gewählten Accounts (${account}) gelöscht.\n`
                + `Dies beinhaltet die getrackte Universumshistorie dieses Servers sofern kein anderer Account für diesen Server getrackt ist.`,
        },
        deleteUniverseHistory: {
            button: (server: string) => `Universumshistorie des aktuell gewählten Universums (${server}) entfernen`,
            confirmationText: (server: string) => `Nach dem Bestätigen dieser Aktion werden alle getrackten Daten zur Universumshistorie des aktuell gewählten Universums (${server}) gelöscht.`,
        },
        deleteEverything: {
            button: 'Alle Daten entfernen',
            confirmationText1: `Nach dem Bestätigen dieser Aktion werden alle Daten gelöscht.\n`
                + 'Das heißt, alle Daten inklusive getrackter Expeditionen, Kämpfe, TF-Abbauberichte, Universumshistorie und mehr, werden entfernt.',
            confirmationText2: 'Bitte bestätige erneut, dass du alle Daten löschen möchtest.',
        },
    },

    importExport: {
        export: {
            header: 'Export',
            description: 'Hier kannst du deine Daten exportieren. Der Export enthält alle relevanten Daten deiner getrackten Accounts und dazugehörigen Servern.',
            includeUniverseHistory: 'auch Universumshistorie exportieren (kann die Dateigröße und Importzeit deutlich erhöhen!)',
            button: 'Export starten',
            wait: 'Bitte warte während deine Daten für den Export vorbereitet werden...',

            errors: {
                unexpectedError: 'Ein unerwarteter Fehler ist während des Exports aufgetreten.',
            },
        },
        import: {
            header: 'Import',
            description: 'Hier kannst du deine Daten aus einer Datei importieren. Bitte wähle die Importdatei.',
            button: 'Import starten',
            wait: 'Bitte warte während deine Daten importiert werden...',

            errors: {
                invalidFormat: 'Das Dateiformat ist ungültig.',
                unexpectedError: 'Ein unerwarteter Fehler ist während des Imports aufgetreten.',
            },
        },

        importCallbacks: {
            importingSettings: 'Einstellungen werden imporiert',
            importingBasicData: 'Grundlegende Account- und Server-Informationen werden importiert',
            importingUniverseHistories: (
                serverIndex: number, 
                serverTotal: number, 
                entryIndex: number, 
                entryTotal: number,
            ) => {
                const baseMessage = 'Universumshistorien werden importiert';

                return `${baseMessage} (Server ${serverIndex + 1}/${serverTotal}, Eintrag ${entryIndex + 1}/${entryTotal})`;      
            },
            importingAccounts: (
                accountIndex: number, 
                totalAccounts: number, 
                type: 'account' | 'combat-reports' | 'expeditions' | 'debris-fields' | 'lifeform-discoveries' | 'universe-specific-settings' | 'empire.data' | 'empire.planets' | 'empire.moons',
                stepIndex: number,
                stepTotal: number,
            ) => {
                const baseMessage = `Accounts werden importiert`;
                const accountProgress = `${accountIndex + 1}/${totalAccounts}`;

                if(type == 'account') {
                    return `${baseMessage} (${accountProgress})`;
                }

                if(type == 'combat-reports') {
                    return `${baseMessage} (${accountProgress}, Kampf ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'expeditions') {
                    return `${baseMessage} (${accountProgress}, Expedition ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'debris-fields') {
                    return `${baseMessage} (${accountProgress}, TF-Berícht ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'lifeform-discoveries') {
                    return `${baseMessage} (${accountProgress}, LF-Mission ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'empire.data') {
                    return `${baseMessage} (${accountProgress}, grundlegende Imperiumsdaten)`;
                }

                if(type == 'empire.planets') {
                    return `${baseMessage} (${accountProgress}, Planet ${stepIndex + 1}/${stepTotal})`;
                }
                if(type == 'empire.moons') {
                    return `${baseMessage} (${accountProgress}, Mond ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'universe-specific-settings') {
                    return `${baseMessage} (${accountProgress}, universumsspezifische Einstellungen)`;
                }

                throw new Error(`Invalid type '${type}'`);
            },
        },
    },
    accessibility: {
        showSimplifiedResults: {
            title: 'Vereinfachte Ansicht',
            label: 'Vereinfachte Ansicht, versteckt Originaltexte von Expeditionsergebnissen und TF-Abbauberichten, und zeigt Icons anstatt Texten in den Benachrichtigungen.',
        },
    },

    debrisFields: {
        separateExpeditionDebrisFields: {
            title: 'TFs von Position 16 separat anzeigen',
            label: 'TFs von Position 16 separat anzeigen',
        },
    },

    linkAccounts: {
        header: (account: string) => `Accounts mit dem aktuellen Account (${account}) verknüpfen`,
        descriptionHtml: (account: string) =>
            `Hier sollten nur Accounts miteinander verknüpft werden, wenn die Daten der gewählten Accounts als Daten des aktuellen Accounts (${account}) behandelt werden sollen.<br/>`
            + `Dies ist zum Beispiel gewünscht, wenn ein Account aufgrund einer Fusion von einem Server auf einen anderen verschoben wurde und somit im Tracker als separater Account behandelt wird, `
            + `aber bspw. die Expeditionen des ursprügnlichen Accounts weiterhin angezeigt werden sollen.<br/><br/>`
            + `Beispiel: <br/>`
            + `<ol>
                    <li>der Spieler "OGame Profi" spielt auf dem Server "DE Milchstraße"</li>
                    <li>der Server "DE Milchstraße" wird nun Exodusuni bei einer Fusion</li>
                    <li>der Spieler "OGame Profi" fusioniert also seinen Account nach "DE Wagenrad"</li>   
                    <li>der OGame Tracker zeigt für den Account nach der Fusion keine Expeditionen mehr vom Ursprungsserver "DE Milchstraße"</li>
                    <li>im OGame Tracker wird der Account "OGame Profi" vom Server "DE Milchstraße" mit dem Account vom Server "DE Wagenrad" verknüpft</li>
                    <li>Expeditionen, die auf dem Ursprungsserver "DE Milchstraße" gesendet wurden, werden nun auch für den fusionierten Account auf dem Server "DE Wagenrad" angezeigt</li>
                </ol>
            `,
        linkAccount: 'weiteren Account verknüpfen:',
        linkedAccounts: 'Verknüpfte Accounts:',
    },
};