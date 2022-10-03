import { _throw } from "../utils/_throw";
import { LanguageKey } from "./LanguageKey";

/** map OGame server language to internal language key */
const languageMap: Partial<Record<string, LanguageKey>> = {
    ar: LanguageKey.es_ar,
    cz: LanguageKey.cz,
    de: LanguageKey.de,
    dk: LanguageKey.dk,
    en: LanguageKey.en,
    fr: LanguageKey.fr,
    hr: LanguageKey.hr,
    si: LanguageKey.si,
    pt: LanguageKey.pt_pt,
    it: LanguageKey.it,
    us: LanguageKey.en,
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