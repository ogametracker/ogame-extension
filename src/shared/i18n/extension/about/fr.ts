import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { AboutTranslations } from "./type";

export const fr: RecursivePartial<AboutTranslations> = {
    faqHelp: {
        header: 'Aide',
        faq: {
            header: 'F.A.Q.',
            fleetLostOnExpedition: {
                header: 'Pourquoi les vaisseaux que j\'ai perdus en expédition ne sont-ils pas suivis?',
                text: "Le suivi des vaisseaux perdus en expédition nécessite un suivi permanent de la flotte, ce qui n'est pas réalisable.",
            },
            syncBetweenDevices: {
                header: 'Pourquoi n\'y a-t-il pas de synchronisation de mes données entre plusieurs appareils?',
                text: 'Le tracker enregistre beaucoup plus de données que ce qui peut être synchronisé avec votre compte utilisateur (Google, Microsoft, etc.). Une synchronisation avec un serveur externe pourrait être possible à l\'avenir.',
            },
            productionInResourceBalance: {
                header: 'Pourquoi la balance des ressources n\'inclut-elle pas ma production de ressources?',
                text: "Votre production de ressources dépend de divers facteurs, et leurs changements devraient être suivis en permanence. Bien que cela soit possible, une mise en œuvre de cette fonctionnalité serait beaucoup plus complexe qu'elle ne serait utile pour ses utilisateurs.",
            },
            whatAreAverages: {
                header: 'Que signifie la mention \'⌀ par jour\'?',
                text: "Il s'agit de la moyenne sur tous les jours avec au moins un événement suivi.",
            },
        },
        tips: {
            header: 'Conseils',
            rightClickDefaultRoute: "Vous pouvez faire un clic droit sur un onglet principal du côté gauche ou sur l'un de ses sous-menu pour définir comme par défaut.",
            numbersKeyboardNavigation: "Vous pouvez ouvrir les pages des onglets avec un chiffre en appuyant sur la touche de chiffre respective de votre clavier.",
            amortizationTable: {
                part1: 'Vous voulez savoir quoi construire ou rechercher ensuite pour améliorer votre production de ressources de la manière la plus efficace? Essayez le\xa0',
                name: 'calculateur d\'amortissement interactif',
                part2: '.',
            },
            inlineSettings: "Vous pouvez changer les paramètres liés immédiatement en appuyant sur la petite icône d'engrenage sur le côté droit.",
            switchAccountHtml: "Vous pouvez ouvrir l'interface OGame Tracker pour un autre compte suivi en cliquant sur l'icône <span class=\"mdi mdi-account-multiple\"></span> et en sélectionnant le compte.",
        },
        messageDiscord: {
            part1: 'Besoin d\'aide ? avez-vous trouvé un bug ou avez-vous une demande de fonctionnalité ? Rejoignez le\xa0',
            discordServer: 'serveur Discord',
            part2: '\xa0et écrivez un message dans le canal correspondant.',
        },
    },
    info: {
        header: 'Info',
        table: {
            currentAccount: {
                header: "Informations sur le compte sélectionné",
                numberOfTrackedExpeditions: 'Nombre d\'expéditions suivies',
                numberOfTrackedCombatReports: 'Nombre de rapports de combat suivis',
                numberOfTrackedDebrisFieldReports: 'Nombre de rapports de récolte CDR suivis',
                numberOfTrackedLifeformDiscoveries: 'Nombre de missions de découverte de formes de vie suivies',
                lastUpdateServerSettings: 'Dernière mise à jour des paramètres du serveur',
                numberOfUniverseHistoryEntries: 'Nombre d\'entrées dans l\'historique de l\'univers',
            },
            global: {
                header: 'Informations sur l\'ensemble des données dans OGame Tracker',
                numberOfTrackedAccounts: 'Nombre de comptes suivis',
                estimatedSize: 'Taille de toutes les données enregistrées sur le disque',
            },
        },
    },
};
