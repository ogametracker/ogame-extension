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
        /*TODO: dk*/lifeformDiscovery: 'Lebensformbericht',
    },
    [LanguageKey.en]: {
        expedition: 'Expeditionsergebnis',
        lifeformDiscovery: 'Lifeform Report',
    },
    [LanguageKey.hr]: {
        /*TODO: hr*/expedition: 'Expeditionsergebnis',
        /*TODO: hr*/lifeformDiscovery: 'Lebensformbericht',
    },
    [LanguageKey.it]: {
        /*TODO: it*/expedition: 'Expeditionsergebnis',
        /*TODO: it*/lifeformDiscovery: 'Lebensformbericht',
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