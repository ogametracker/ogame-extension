import { LanguageKey } from "@/shared/i18n/LanguageKey";

export const messageHeaders: Record<LanguageKey, Record<'expedition' | 'lifeformDiscovery', string>> = {
    [LanguageKey.cz]: {
        expedition: 'Výsledek expedice',
        lifeformDiscovery: 'Zpráva o formách života',
    },
    [LanguageKey.de]: {
        expedition: 'Expeditionsergebnis',
        lifeformDiscovery: 'Lebensformbericht',
    },
    [LanguageKey.dk]: {
        expedition: 'Ekspeditionsresultat',
        lifeformDiscovery: 'Livsform Rapport',
    },
    [LanguageKey.en]: {
        expedition: 'Expedition Result',
        lifeformDiscovery: 'Lifeform Report',
    },
    [LanguageKey.hr]: {
        /*TODO: hr*/expedition: 'Expeditionsergebnis',
        /*TODO: hr*/lifeformDiscovery: 'Lebensformbericht',
    },
    [LanguageKey.it]: {
        expedition: 'Risultato della Spedizione',
        lifeformDiscovery: 'Resoconto Forme di vita',
    },
    [LanguageKey.pt]: {
        expedition: 'Resultado da Exploração Espacial',
        lifeformDiscovery: 'Relatório de Forma de Vida',
    },
    [LanguageKey.si]: {
        expedition: 'Rezultat ekspedicije',
        /*TODO: si*/lifeformDiscovery: 'Lebensformbericht',
    },
};