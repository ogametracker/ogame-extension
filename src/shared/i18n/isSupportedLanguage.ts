import { LanguageKey } from "./LanguageKey";

export function isSupportedLanguage(key: string): boolean {
    return Object.keys(LanguageKey).includes(key);
}