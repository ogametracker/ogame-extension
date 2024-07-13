import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { SettingsTranslations } from "./type";

export const fr: RecursivePartial<SettingsTranslations> = {
    tabs: {
        dateRanges: 'Plages de dates',
        colors: 'Couleurs',
        common: 'Commun',
        importExport: 'Importation/Exportation',
        expeditions: 'Expéditions',
        combats: 'Combats',
        debrisFields: 'Champs de débris',
        resourceBalance: 'Balance des ressources',
        universeHistory: 'Historique de l\'univers',
        dangerZone: 'Zone dangereuse',
        accessbility: 'Accessibilité',
        linkAccounts: 'Lier les comptes',

        migrateOldData: 'Migrer les anciennes données',
    },
    dateRanges: {
        defaultNames: {
            today: 'Aujourd\'hui',
            yesterday: 'Hier',
            currentWeek: 'Semaine en cours',
            lastWeek: 'Semaine dernière',
            currentMonth: 'Mois en cours',
            newRange: 'nouvelle plage',
        },
        since: (date) => `Depuis le ${date}`,
        firstDayTemplate: '<premier jour>',
        headers: {
            label: 'Étiquette',
            type: 'Type',
            rangeStart: 'Début de la plage',
            rangeContains: 'La plage contient',
        },
        day: 'jour',
        days: 'jours',
        daysAgo: 'jours auparavant',
        week: 'semaine',
        weeks: 'semaines',
        weeksAgo: 'semaines auparavant',
        month: 'mois',
        months: 'mois',
        monthsAgo: 'mois auparavant',
        year: 'année',
        years: 'années',
        yearsAgo: 'années auparavant',
    },
    colors: {
        combatResults: 'Résultats des combats',
        expeditionEvents: 'Événements d\'expédition',
        expeditionEventSizes: 'Tailles d\'événements d\'expédition',
        expeditionDepletionLevels: 'Épuisement du système',
        lifeformDiscoveries: 'Découvertes de formes de vie',
        lifeforms: 'Formes de vie',
        resources: 'Ressources',
        ships: 'Vaisseaux',
    },
    common: {
        conversionRates: {
            title: 'Taux de conversion',
            msuLong: 'Convertir en Métal (USM)',
            dsuLong: 'Convertir en Deutérium (USD)',
        },
        extensionLanguage: 'Langue de l\'interface utilisateur (dans OGame Tracker)',
        extensionLanguageFallbackHint: 'Les textes en anglais seront affichés si les textes ne sont pas disponibles dans la langue sélectionnée.',

        serverSettings: {
            title: 'Données du serveur',
            lastUpdate: 'Dernière mise à jour',
            forceUpdate: 'Mettre à jour les données du serveur',
        },
    },
    expeditions: {
        resourceUnitFactorsOfShipFoundOnExpeditions: 'Pondération de la valeur en ressources des vaisseaux trouvés lors des expéditions',
    },
    combats: {
        resourceUnitFactorsOfLostShips: 'Pondération de la valeur en ressources des vaisseaux perdus en combat',
        ignoreEspionageCombats: {
            title: 'Ignorer les combats d\'espionnage',
            label: 'Ignorer les rapports de combat d\'espionnage pour le suivi des combats',
        },
    },
    resourceBalance: {
        detailedResourceBalance: {
            header: 'Bilan détaillé des ressources',
            checkboxLabel: 'Afficher le bilan détaillé des ressources',
        },
        includeShipsFoundOnExpeditions: {
            header: 'Vaisseaux trouvés lors des expéditions',
            checkboxLabel: 'Inclure les ressources des vaisseaux trouvés lors des expéditions dans le bilan des ressources',
        },
        includeShipsLostInCombats: {
            header: 'Vaisseaux perdus en combats',
            checkboxLabel: 'Inclure les ressources des vaisseaux perdus en combats dans le bilan des ressources',
        },
        includeLostLootResources: {
            header: 'Ressources perdues en combats',
            checkboxLabel: 'Inclure les ressources perdues en combats dans le bilan des ressources',
        },
    },
    showConvertedUnitsInTables: {
        title: 'USM/USD dans les tables',
        label: 'Afficher les valeurs converties USM/USD dans les tables',

        infoAmortization: 'Le temps d\'amortissement sera toujours calculé en utilisant le coût et la production en USM/USD',
    },

    reset: 'Réinitialiser les paramètres',
    setDefaultRoute: 'Définir comme par défaut',
    setDefaultSubRoute: 'Définir comme par défaut pour cette zone',

    dangerZone: {
        doYouWantToContinue: 'ÊTES-VOUS SÛR DE VOULOIR CONTINUER ?',

        deleteExpeditions: {
            button: (account: string) => `Supprimer toutes les expéditions suivies pour le compte actuellement sélectionné (${account})`,
            confirmationText: (account: string, count: string) => `Si vous confirmez, toutes les ${count} expéditions suivies seront supprimées pour le compte actuellement sélectionné (${account}).`,
        },
        deleteCombats: {
            button: (account: string) => `Supprimer tous les combats suivis pour le compte actuellement sélectionné (${account})`,
            confirmationText: (account: string, count: string) => `Si vous confirmez, tous les ${count} combats suivis seront supprimés pour le compte actuellement sélectionné (${account}).`,
        },
        deleteDebrisFieldReports: {
            button: (account: string) => `Supprimer tous les rapports de récolte de champs de débris suivis pour le compte actuellement sélectionné (${account})`,
            confirmationText: (account: string, count: string) => `Si vous confirmez, tous les ${count} rapports de récolte de champs de débris suivis seront supprimés pour le compte actuellement sélectionné (${account}).`,
        },
        deleteAccount: {
            button: (account: string) => `Supprimer toutes les données du compte actuellement sélectionné (${account})`,
            confirmationText: (account: string) => `Si vous confirmez, toutes les données suivies pour le compte actuellement sélectionné (${account}) seront supprimées.\n`
                + `Cela inclut les données suivies de l'historique de l'univers s'il n'y a pas d'autre compte suivi pour cet univers.`,
        },
        deleteUniverseHistory: {
            button: (server: string) => `Supprimer l'historique de l'univers suivi du serveur actuellement sélectionné (${server})`,
            confirmationText: (server: string) => `Si vous confirmez, toutes les données d'historique de l'univers suivies pour le serveur actuellement sélectionné (${server}) seront supprimées.`,
        },
        deleteEverything: {
            button: 'Supprimer toutes les données',
            confirmationText1: `Si vous confirmez, toutes les données seront supprimées.\n`
                + 'Cela inclut les données suivies de chaque compte, y compris les expéditions suivies, les combats suivis, les rapports de récolte de champs de débris suivis, les données d\'historique de l\'univers et plus encore.',
            confirmationText2: 'Veuillez confirmer à nouveau que vous voulez supprimer toutes les données.',
        },
    },

    importExport: {
        export: {
            header: 'Exporter',
            description: 'Ici, vous pouvez exporter vos données. Cela inclura les données pertinentes de tous vos comptes suivis et de leurs serveurs.',
            includeUniverseHistory: 'inclure l\'historique de l\'univers dans l\'exportation (cela peut considérablement augmenter la taille du fichier et le temps d\'importation !)',
            button: 'Commencer l\'exportation',
            wait: 'Veuillez patienter pendant que vos données sont préparées pour l\'exportation...',

            errors: {
                unexpectedError: 'Une erreur inattendue s\'est produite lors de l\'exportation de vos données.',
            },
        },
        import: {
            header: 'Importer',
            description: 'Ici, vous pouvez importer vos données à partir d\'un fichier. Veuillez sélectionner votre fichier.',
            button: 'Commencer l\'importation',
            wait: 'Veuillez patienter pendant que vos données sont importées...',

            errors: {
                invalidFormat: 'Le format du fichier est invalide.',
                unexpectedError: 'Une erreur inattendue s\'est produite lors de l\'importation de vos données.',
            },
        },

        importCallbacks: {
            importingSettings: 'Importation de vos paramètres',
            importingBasicData: 'Importation des données de base du compte et du serveur',
            importingUniverseHistories: (
                serverIndex: number, 
                serverTotal: number, 
                entryIndex: number, 
                entryTotal: number,
            ) => {
                const baseMessage = `Importation de l'historique de l'univers du serveur`;

                return `${baseMessage} (serveur ${serverIndex + 1}/${serverTotal}, entrée ${entryIndex + 1}/${entryTotal})`;      
            },
            importingAccounts: (
                accountIndex: number, 
                totalAccounts: number, 
                type: 'account' | 'combat-reports' | 'expeditions' | 'debris-fields' | 'lifeform-discoveries' | 'universe-specific-settings' | 'empire.data' | 'empire.planets' | 'empire.moons',
                stepIndex: number,
                stepTotal: number,
            ) => {
                const baseMessage = `Importation des comptes`;
                const accountProgress = `${accountIndex + 1}/${totalAccounts}`;

                if(type == 'account') {
                    return `${baseMessage} (${accountProgress})`;
                }

                if(type == 'combat-reports') {
                    return `${baseMessage} (${accountProgress}, combat ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'expeditions') {
                    return `${baseMessage} (${accountProgress}, expédition ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'debris-fields') {
                    return `${baseMessage} (${accountProgress}, champ de débris ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'lifeform-discoveries') {
                    return `${baseMessage} (${accountProgress}, mission de découverte ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'empire.data') {
                    return `${baseMessage} (${accountProgress}, données de base de l'empire)`;
                }

                if(type == 'empire.planets') {
                    return `${baseMessage} (${accountProgress}, planète ${stepIndex + 1}/${stepTotal})`;
                }
                if(type == 'empire.moons') {
                    return `${baseMessage} (${accountProgress}, lune ${stepIndex + 1}/${stepTotal})`;
                }

                if(type == 'universe-specific-settings') {
                    return `${baseMessage} (${accountProgress}, paramètres spécifiques à l'univers)`;
                }

                throw new Error(`Invalid type '${type}'`);
            },
        },
    },
    accessibility: {
        showSimplifiedResults: {
            title: 'Visualisation simplifiée',
            label: 'Visualisation simplifiée, masque les messages originaux des résultats d\'expédition et des rapports de récolte de champs de débris, et affiche des icônes au lieu de textes dans les notifications.',
        },
    },

    debrisFields: {
        separateExpeditionDebrisFields: {
            title: 'Séparer la position 16',
            label: 'Séparer les champs de débris récoltés en position 16 des positions 1 à 15',
        },
    },

    linkAccounts: {
        header: (account: string) => `Lier des comptes avec le compte actuel (${account})`,
        descriptionHtml: (account: string) =>
            `Vous ne devriez lier des comptes que si vous voulez que l'OGame Tracker considère les données des comptes liés comme des données du compte actuel (${account}).<br/>`
            + `C'est souvent le cas lorsque qu'un compte a été fusionné avec un autre serveur et est traité comme un compte distinct dans l'OGame Tracker.<br/><br/>`
            + `Exemple: <br/>`
            + `<ol>
                    <li>le joueur "OGame Professional" joue sur le serveur "FR Voie Lactée"</li>
                    <li>le serveur "FR Voie Lactée" devient un univers exode lors d'une fusion</li>
                    <li>le joueur "OGame Professional" fusionne son compte avec "FR Trèfle"</li>
                    <li>après la fusion, l'OGame Tracker ne montre aucune expédition de l'ancien serveur "FR Voie Lactée" pour le compte fusionné</li>
                    <li>dans l'OGame Tracker, l'ancien compte "OGame Professional" sur le serveur "FR Voie Lactée" est lié au nouveau compte "OGame Professional" sur le serveur "FR Trèfle"</li>
                    <li>les expéditions qui ont été envoyées sur l'ancien serveur "FR Voie Lactée" apparaîtront maintenant à nouveau pour le compte fusionné sur "FR Trèfle"</li>
                </ol>
            `,
        linkAccount: 'lier un autre compte :',
        linkedAccounts: 'Comptes liés :',
    },
};
