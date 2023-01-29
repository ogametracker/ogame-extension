import { _throw } from "../utils/_throw";
import { LanguageKey } from "./LanguageKey";

/** map OGame server language to internal language key */
const languageMap: Partial<Record<string, LanguageKey>> = {
    ar: LanguageKey['es-ar'],
    br: LanguageKey['pt-br'],
    cz: LanguageKey.cz,
    de: LanguageKey.de,
    dk: LanguageKey.dk,
    en: LanguageKey.en,
    es: LanguageKey['es-es'],
    fr: LanguageKey.fr,
    hr: LanguageKey.hr,
    hu: LanguageKey.hu,
    it: LanguageKey.it,
    mx: LanguageKey['es-mx'],
    pl: LanguageKey.pl,
    pt: LanguageKey['pt-pt'],
    si: LanguageKey.si,
    us: LanguageKey.en,
    tw: LanguageKey['zh-tw'],
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