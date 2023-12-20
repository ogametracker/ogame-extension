import { ExpeditionEventSize } from "@/shared/models/expeditions/ExpeditionEventSize";
import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { ExpeditionsTranslations } from "./type";
import { en as ogamePremium } from '../../ogame/premium/en';
import { en as ogameFactions } from '../../ogame/factions/en';
import { ExpeditionDepletionLevel } from "@/shared/models/expeditions/ExpeditionDepletionLevel";
import { RecursivePartial } from "@/shared/types/RecursivePartial";

export const pt_pt: RecursivePartial<ExpeditionsTranslations> = {
    header: 'Expedições',
    tabHeaders: {
        overview: 'Resumo',
        foundResources: 'Recursos',
        foundShips: 'Naves',
        foundDarkMatter: ogamePremium.darkMatter,
        foundItems: 'Items',
        depletion: 'Desgaste',
        info: {
            header: 'Info',

            topFinds: 'Melhores Descobertas',
            possibleFinds: 'Lista de possíveis descobertas',
        },

        subHeaders: {
            amount: 'Quantidade',
            sizes: 'Tamanhos',
            resources: 'Unidades de recurso',
            count: 'Contagem',
            sizesByResource: 'Tamanhos por recursos',
        },
    },

    expeditionEvents: {
        [ExpeditionEventType.nothing]: 'Sem evento',
        [ExpeditionEventType.resources]: 'Recursos',
        [ExpeditionEventType.fleet]: 'Naves',
        [ExpeditionEventType.delay]: 'Atraso',
        [ExpeditionEventType.early]: 'Cedo',
        [ExpeditionEventType.darkMatter]: ogamePremium.darkMatter,
        [ExpeditionEventType.pirates]: ogameFactions.pirates,
        [ExpeditionEventType.aliens]: ogameFactions.aliens,
        [ExpeditionEventType.item]: 'Item',
        [ExpeditionEventType.trader]: 'Mercador',
        [ExpeditionEventType.lostFleet]: 'Frota Perdida',
    },
    expeditionEventSizes: {
        [ExpeditionEventSize.small]: 'Descoberta Comum',
        [ExpeditionEventSize.medium]: 'Descoberta Grande',
        [ExpeditionEventSize.large]: 'Descoberta Enorme',
        'fled-death-star': 'Inimigos fugiram',
    },
    depletionLevels: {
        [ExpeditionDepletionLevel.none]: 'Muito baixo',
        [ExpeditionDepletionLevel.low]: 'Baixo',
        [ExpeditionDepletionLevel.medium]: 'Médio',
        [ExpeditionDepletionLevel.high]: 'Alto',
        unknown: 'Desconhecido',
    },

    expeditions: 'Expedições',
    finds: 'Descobertas',
    shipsFound: 'Naves encontradas',
    depletion: 'Desgate do sistema',

    topFinds: {
        title: (type: string) => `Melhores descobertas (${type})`,
        shipUnits: 'Unidades de naves',
        shipUnitsIncludingDeuterium: 'Unidades de naves c/ Deutério',

        size: 'Tamanho',
        amount: 'Quantidade',
        date: 'Data',
    },
    possibleFinds: {
        info: {
            playerClass: 'Classe do Jogador',
            economySpeed: 'Velocidade da Economia',
            resourceFindBonus: 'Bónus de descobertas de recursos',
            shipFindBonus: 'Bónus de decobertas de naves',
            darkMatterFindBonus: 'Bónus de descobertas de Matéria Negra',
            discovererBonus: 'Bónus de Classe de Descobridor',
        },

        maximumFinds: 'Máximo de Descobertas',
        findsDarkMatter: 'Limites das descobertas de MN',

        listOfPossibleFinds: 'Lista de possíveis descobertas (recursos, naves)',
        findSizes: (size: string) => `Possíveis quantidades de descobertas (${size})`,
        shipUnits: 'Unidades de naves',
    },
};