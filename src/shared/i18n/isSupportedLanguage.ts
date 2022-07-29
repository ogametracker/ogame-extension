import { getLanguage } from "./getLanguage";

export function isSupportedLanguage(key: string): boolean {
    return getLanguage(key) != null;
}