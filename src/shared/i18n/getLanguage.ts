import { _throw } from "../utils/_throw";
import { LanguageKey } from "./LanguageKey";

/** map OGame server language to internal language key */
const languageMap: Partial<Record<string, LanguageKey>> = {
    ar: LanguageKey['es-ar'],
    br: LanguageKey['pt-br'],
    cz: LanguageKey.cs,
    de: LanguageKey.de,
    dk: LanguageKey.da,
    en: LanguageKey.en,
    es: LanguageKey['es-es'],
    fr: LanguageKey.fr,
    //TODO: fi finnish
    gr: LanguageKey.el,
    hr: LanguageKey.hr,
    hu: LanguageKey.hu,
    it: LanguageKey.it,
    //TODO: jp japanese
    mx: LanguageKey['es-mx'],
    nl: LanguageKey.nl,
    pl: LanguageKey.pl,
    pt: LanguageKey['pt-pt'],
    ro: LanguageKey.ro,
    ru: LanguageKey.ru,
    //TODO: se swedish
    si: LanguageKey.sl,
    //TODO: sk slovakian
    tr: LanguageKey.tr,
    us: LanguageKey.en,
    tw: LanguageKey['zh-tw'],
    //TODO yu bosnian (wtf why is it `yu` for yugoslavian?)
};

export function getLanguage(serverLanguage: string, throwIfUnsupported: boolean): LanguageKey;
export function getLanguage(serverLanguage: string): LanguageKey | undefined;

export function getLanguage(serverLanguage: string, throwIfUnsupported = false): LanguageKey | undefined {
    const lang = languageMap[serverLanguage];
    if (lang == null && throwIfUnsupported) {
        _throw(`unsupported language '${serverLanguage}'`)
    }

    return lang;
}