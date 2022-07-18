import { getLanguage } from "./getLanguage";
import { LanguageKey } from "./LanguageKey";

export function isSupportedLanguage(key: string): boolean {
    return getLanguage(key) != null;
}