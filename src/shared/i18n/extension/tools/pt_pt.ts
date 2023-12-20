import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { ToolsTranslations } from "./type";

export const pt_pt: RecursivePartial<ToolsTranslations> = {
    signatureGenerator: {
        header: 'Gerador de Assinatura',
        
        averagePerHour: '⌀/hora',
        totalPerHour: 'por hora',
        totalPerDay: 'por dia',
        totalPerWeek: 'por semana',
        production: 'Produção',

        expeditions: 'Expedições',
        lifeformDiscoveries: 'Missões FV',
        combats: 'Combates',
        debrisFieldReports: 'Destroços reciclados',
    },
    scrapyardMerchant: {
        header: 'Mercador de Sucata',
        percentage: '% no Mercador de Sucata',
        count: 'Contagem',
    },
};
