import { RecursivePartial } from "@/shared/types/RecursivePartial";
import { ToolsTranslations } from "./type";

export const fr: RecursivePartial<ToolsTranslations> = {
    signatureGenerator: {
        header: 'Générateur de signature',

        averagePerHour: '⌀/heure',
        totalPerHour: 'par heure',
        totalPerDay: 'par jour',
        totalPerWeek: 'par semaine',
        production: 'Production',

        expeditions: 'Expéditions',
        lifeformDiscoveries: 'Découvertes FdV',
        combats: 'Combats',
        debrisFieldReports: 'Rapports de champs de débris',
    },
    scrapyardMerchant: {
        header: 'Ferrailleur',
        percentage: '% au ferrailleur',
        count: 'Compte',
    },

};
