import { LanguageKey } from "@/shared/i18n/LanguageKey";

export const messageHeaders: Record<LanguageKey, Record<'expedition' | 'lifeformDiscovery' | 'debrisField', string>> = {
    [LanguageKey.cz]: {
        expedition: 'Výsledek expedice',
        lifeformDiscovery: 'Zpráva o formách života',
        debrisField: 'Těžební zpráva z pole',
    },
    [LanguageKey.de]: {
        expedition: 'Expeditionsergebnis',
        lifeformDiscovery: 'Lebensformbericht',
        debrisField: 'Schürfbericht von TF',
    },
    [LanguageKey.dk]: {
        expedition: 'Ekspeditionsresultat',
        lifeformDiscovery: 'Livsform Rapport',
        debrisField: 'Recyclerarbejde af ruinmarken',
    },
    [LanguageKey.en]: {
        expedition: 'Expedition Result',
        lifeformDiscovery: 'Lifeform Report',
        debrisField: 'Harvesting report from DF',
    },
    [LanguageKey.hr]: {
        /*TODO: hr*/expedition: 'Expeditionsergebnis',
        /*TODO: hr*/lifeformDiscovery: 'Lebensformbericht',
        /*TODO: hr*/debrisField: 'Schürfbericht von TF',
    },
    [LanguageKey.it]: {
        expedition: 'Risultato della Spedizione',
        lifeformDiscovery: 'Resoconto Forme di vita',
        debrisField: 'Rapporto raccolta detriti',
    },
    [LanguageKey.pt]: {
        expedition: 'Resultado da Exploração Espacial',
        lifeformDiscovery: 'Relatório de Forma de Vida',
        debrisField: 'Campo de Destroços',
    },
    [LanguageKey.si]: {
        expedition: 'Rezultat ekspedicije',
        /*TODO: si*/lifeformDiscovery: 'Lebensformbericht',
        debrisField: 'Poročilo reciklaže',
    },
};