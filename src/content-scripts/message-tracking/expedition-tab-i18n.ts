import { LanguageKey } from "@/shared/i18n/LanguageKey";

export const messageHeaders: Record<LanguageKey, Record<'expedition' | 'lifeformDiscovery', string>> = {
    [LanguageKey.cz]: {
        expedition: 'Výsledek expedice',
        /*TODO: cz*/lifeformDiscovery: 'Lebensformbericht',
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
        /*TODO: pt*/lifeformDiscovery: 'Lebensformbericht',
    },
    [LanguageKey.si]: {
        expedition: 'Rezultat ekspedicije',
        /*TODO: si*/lifeformDiscovery: 'Lebensformbericht',
    },
};