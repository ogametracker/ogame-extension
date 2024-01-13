import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { ExcelExportTranslations } from "./type";

export const fr: RecursivePartial<ExcelExportTranslations> = {
    header: 'Export Excel',
    chooseBelowMessage: 'Choisissez ci-dessous les données que vous souhaitez inclure dans l\'exportation :',
    groups: {
        expeditions: {
            header: 'Expéditions',
            rawData: 'Données brutes (chaque expédition suivie)',
            dailyOverview: 'Vue d\'ensemble des résultats par jour',
            dailyDepletion: 'Vue d\'ensemble de l\'épuisement du système par jour',
            dailyResources: 'Découvertes de ressources par jour',
            dailyResourceSizes: 'Tailles des découvertes de ressources par jour',
            dailyShips: 'Découvertes de vaisseaux par jour',
            dailyShipSizes: 'Tailles des découvertes de vaisseaux par jour',
            dailyDarkMatter: 'Découvertes d\'Antimatière par jour',
            dailyDarkMatterSizes: 'Tailles des découvertes de d\'Antimatière par jour',
        },
        combats: {
            header: 'Combats',
            rawData: 'Données brutes (chaque résultat de combat suivi)',
            dailyResults: 'Résultats de combat par jour',
            dailyLoot: 'Bilan du butin par jour',
            dailyLostShips: 'Vaisseaux perdus par jour',
        },
        debrisFields: {
            header: 'Champs de débris',
            rawData: 'Données brutes (chaque rapport de récolte suivi)',
            dailyResources: 'Ressources récoltées par jour',
        },
        lifeformDiscoveries: {
            header: 'Missions de découverte',
            rawData: 'Données brutes (chaque mission de découverte suivie)',
            dailyExperience: 'Expérience gagnée par jour',
        },
    },
    generateButton: 'Générer l\'export Excel',

    expeditions: {
        prefix: 'EX',

        sheets: {
            rawData: 'Données brutes',
            dailyDepletion: 'Épuisement quotidien du système',
            dailyResults: 'Résultats quotidiens',
            dailyResources: 'Ressources quotidiennes',
            dailyResourcesSize: 'Ressources quotidiennes (Taille)',
            dailyShips: 'Vaisseaux quotidiens',
            dailyShipsSize: 'Vaisseaux quotidiens (Taille)',
            dailyDarkMatter: 'Antimatière quotidienne',
            dailyDarkMatterSize: 'Antimatière quotidienne (Taille)',
        },

        eventType: 'Type',
        eventSize: 'Taille',
        item: 'Objet',
    },
    combats: {
        prefix: 'CR',

        sheets: {
            rawData: 'Données brutes',
            dailyResults: 'Résultats quotidiens',
            dailyLoot: 'Butin quotidien',
            dailyLostShips: 'Vaisseaux perdus quotidiens',
        },

        result: 'Résultat du combat',
        coordinates: 'Coordonnées',
        galaxy: 'Galaxie',
        system: 'Système',
        position: 'Position',
        targetType: 'Type de cible',
        combatType: 'Type de combat',
        expeditionCombatOpponent: 'Opposant de combat en expédition',
        loot: 'Butin',
        lostShips: 'Vaisseaux perdus',
        debrisField: 'Champ de débris',
        moon: 'Lune',
        planet: 'Planète',
        expeditionCombat: 'Combat en expédition',
        playerCombat: 'Combat de joueur',
        pirates: 'Pirates',
        aliens: 'Aliens',

        againstPlayers: 'Contre les joueurs',
        onExpeditions: 'En expéditions',
    },
    debrisFields: {
        prefix: 'DF',

        sheets: {
            rawData: 'Données brutes',
            dailyResources: 'Ressources quotidiennes',
        },
    },
    lifeformDiscoveries: {
        prefix: 'LF',

        sheets:{
            rawData: 'Données brutes',
            dailyExperience: 'Expérience quotidienne',
        },

        result: 'Découverte',
        experience: 'Expérience',
        lifeform: 'Forme de vie',
        artifacts: 'Artéfacts',
        artifactsSize: 'Taille',
    },
};
