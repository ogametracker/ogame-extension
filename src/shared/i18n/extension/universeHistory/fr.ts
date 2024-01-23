import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { UniverseHistoryTranslations } from "./type";

export const fr: RecursivePartial<UniverseHistoryTranslations> = {
    header: 'Historique de l`\'univers',
    settings: {
        messages: {
            notEnabledHtml: `
                <b>Le suivi du classement de l'univers n'est pas activé.</b><br/>
                Activer cette fonctionnalité permettra de suivre les changements de classement pour les joueurs et les alliances.
            `,
            historyTrackingNotEnabledHtml: `
                <b>Le suivi de l'historique de l'univers n'est pas activé.</b><br/>
                Activer cette fonctionnalité permettra de suivre également tous les changements pour les joueurs et les alliances.<br/>
                Cela inclut les changements de nom et de tag des joueurs et des alliances, les changements de membres d'alliance,
                les changements d'état des joueurs et les changements concernant les planètes et les lunes, y compris les noms, les coordonnées,
                et les planètes et lunes abandonnées/détruites.<br />
                <i>Cela peut générer beaucoup de données !
                Vous pouvez désactiver cette fonctionnalité <a href="#/settings/universe-history">dans le menu des paramètres</a>
                à nouveau.</i>
            `,
            trackingTimesHtml: `
                Au moins une fois par jour, les classements et les données de l'univers (si activés) seront mis à jour.<br/>
                Vous pouvez définir les heures de mise à jour ci-dessous.
                Si une mise à jour est manquée, elle sera effectuée dès que possible par la suite.
            `
        },
        enableHighscoreTrackingOnly: 'Activer uniquement le suivi du classement de l\'univers',
        enableHistoryTracking: 'Activer le suivi de l\'historique de l\'univers',
    },

    tabs: {
        players: 'Joueurs',
        alliances: 'Alliances',

        subtabs: {
            highscore: 'Classement',
            history: 'Historique',
        },
    },

    playerSelection: {
        header: 'Sélection du joueur',
        search: 'Rechercher un joueur',
    },
    allianceSelection: {
        header: 'Sélection de l\'alliance',
        search: 'Rechercher une alliance',
    },

    highscoreTabs: {
        total: 'Total',
        economy: 'Économie',
        research: 'Recherche',
        military: 'Militaire',
        militaryBuilt: 'Militaire construit',
        militaryDestroyed: 'Militaire détruit',
        militaryLost: 'Militaire perdu',
        honor: 'Honneur',
        numberOfShips: 'Nombre de vaisseaux',
        lifeform: 'Forme de vie',
        lifeformDiscoveries: 'Découvertes des formes de vie',
        lifeformEconomy: 'Économie des formes de vie',
        lifeformTechnology: 'Technologie des formes de vie',
    },
    historyTabs: {
        status: 'Statut',
        nicknames: 'Alias',
        alliances: 'Alliances',
        planetAndMoons: 'Planètes et Lunes',

        tags: 'Balises',
        names: 'Noms',
        members: 'Membres',
    },

    noAlliance: 'pas d\'alliance',
    today: 'aujourd\'hui',
    name: 'Nom',
    tag: 'Balise',
    members: 'Membres',
    alliance: 'Alliance',
    from: 'De',
    until: 'Jusqu\'à',

    status: {
        active: 'Actif',
        vacation: 'Mode vacances',
        inactive: 'Inactif (>= 7 jours)',
        inactiveLong: 'Inactif (>= 28 jours)',
        banned: 'Banni',
        outlaw: 'Hors-la-loi',
        deleted: 'Supprimé',
        admin: 'Admin',
    },

    loadingTakingLong: 'Le chargement des données prend plus de temps que prévu. La base de données est probablement en train de se mettre à jour, veuillez patienter ou réessayer plus tard.',
};
