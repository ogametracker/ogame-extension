import { ExpeditionEventSize } from "@/shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { ExpeditionsTranslations } from "./type";
import { fr as ogamePremium } from '../../ogame/premium/fr';
import { fr as ogameFactions } from '../../ogame/factions/fr';
import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { RecursivePartial } from "@/shared/types/RecursivePartial";

export const fr: RecursivePartial<ExpeditionsTranslations> = {header: 'Expéditions',
    tabHeaders: {
        overview: 'Vue d\'ensemble',
        foundResources: 'Ressources',
        foundShips: 'Vaisseaux',
        foundDarkMatter: ogamePremium.darkMatter,
        foundItems: 'Objets',
        depletion: 'Épuisement',
        info: {
            header: 'Info',

            topFinds: 'Meilleures découvertes',
            possibleFinds: 'Liste des découvertes possibles',
        },

        subHeaders: {
            amount: 'Quantité',
            sizes: 'Tailles',
            resources: 'Unités de ressources',
            count: 'Nombre',
            sizesByResource: 'Tailles par ressource',
        },
    },

    expeditionEvents: {
        [ExpeditionEventType.nothing]: 'Aucun événement',
        [ExpeditionEventType.resources]: 'Ressources',
        [ExpeditionEventType.fleet]: 'Vaisseaux',
        [ExpeditionEventType.delay]: 'Retard',
        [ExpeditionEventType.early]: 'Avance',
        [ExpeditionEventType.darkMatter]: ogamePremium.darkMatter,
        [ExpeditionEventType.pirates]: ogameFactions.pirates,
        [ExpeditionEventType.aliens]: ogameFactions.aliens,
        [ExpeditionEventType.combat]: 'Combat',
        [ExpeditionEventType.item]: 'Objet',
        [ExpeditionEventType.trader]: 'Marchand',
        [ExpeditionEventType.lostFleet]: 'Flotte perdue',
    },
    expeditionEventSizes: {
        [ExpeditionEventSize.small]: 'Découverte commune',
        [ExpeditionEventSize.medium]: 'Découverte importante',
        [ExpeditionEventSize.large]: 'Découverte exceptionnelle',
        'fled-death-star': 'Ennemis ont fui',
    },
    depletionLevels: {
        [ExpeditionDepletionLevel.none]: 'Très bas',
        [ExpeditionDepletionLevel.low]: 'Bas',
        [ExpeditionDepletionLevel.medium]: 'Moyen',
        [ExpeditionDepletionLevel.high]: 'Élevé',
        unknown: 'Inconnu',
    },

    expeditions: 'Expéditions',
    finds: 'Découvertes',
    shipsFound: 'Vaisseaux trouvés',
    depletion: 'Épuisement du système',

    topFinds: {
        title: (type: string) => `Meilleures découvertes (${type})`,
        shipUnits: 'Unités de vaisseaux',

        size: 'Taille',
        amount: 'Quantité',
        date: 'Date',
    },
    possibleFinds: {
        info: {
            playerClass: 'Classe du joueur',
            economySpeed: 'Vitesse économique',
            resourceFindBonus: 'Bonus de découvertes de ressources',
            shipFindBonus: 'Bonus de découvertes de vaisseaux',
            darkMatterFindBonus: 'Bonus de découvertes d\'Antimatière',
            discovererBonus: 'Bonus de classe Explorateur',
        },

        maximumFinds: 'Découvertes maximales',
        findsDarkMatter: 'Plages de découvertes d\'Antimatière',

        listOfPossibleFinds: 'Liste des découvertes possibles (ressources, unités de vaisseaux)',
        findSizes: (size: string) => `Quantités possibles (${size})`,
        shipUnits: 'Unités de vaisseaux',
    },
};
