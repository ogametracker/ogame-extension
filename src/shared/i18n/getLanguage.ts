import { _throw } from "../utils/_throw";
import { LanguageKey } from "./LanguageKey";

const languageMap: Partial<Record<string, LanguageKey>> = {
    de: LanguageKey.de,
    dk: LanguageKey.dk,

    en: LanguageKey.en,
    us: LanguageKey.en,

    cz: LanguageKey.cz,

    hr: LanguageKey.hr,
    ba: LanguageKey.hr,

    si: LanguageKey.si,

    pt: LanguageKey.pt,
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