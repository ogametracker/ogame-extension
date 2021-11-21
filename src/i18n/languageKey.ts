enum LanguageKey {
    de = 'de',
    dk = 'dk',
    en = 'en',
    cz = 'cz',
}

export default LanguageKey;
export const Languages = Object.values(LanguageKey);

export type PartialLanguageKey = Exclude<LanguageKey, 'de'>;
export const PartialLanguages: Record<PartialLanguageKey, PartialLanguageKey> = Object.values(LanguageKey)
    .filter(v => v != LanguageKey.de)
    .reduce((acc, lang) => ({
        ...acc,
        [lang]: lang,
    }), {} as Record<PartialLanguageKey, PartialLanguageKey>);