import { _throw } from '@/shared/utils/_throw';
import { LanguageKey } from '../LanguageKey';
import type { RecursivePartial } from '@/shared/types/RecursivePartial';

type RequiredLanguageKey = LanguageKey.de | LanguageKey.en;
type PartialLanguageKey = Exclude<LanguageKey, RequiredLanguageKey>;

export type I18nMessageMap<T> = Record<RequiredLanguageKey, T> & RecursivePartial<Record<PartialLanguageKey, T>>;

interface TranslationContext {
    readonly locale: LanguageKey;
    readonly fallbackLocales: readonly LanguageKey[];
    throwOnDisabled?(): void;
}

export function createTranslationTree<T>(
    context: TranslationContext,
    messages: Partial<Record<LanguageKey, object>>,
): T {
    const tree: Record<string, unknown> = {};
    const cache: Partial<Record<LanguageKey, Record<string, unknown>>> = {};

    function addTranslations(
        root: Record<string, unknown>,
        values: object,
        language: LanguageKey,
        prefix: string,
    ) {
        for (const [key, value] of Object.entries(values)) {
            const storageKey = `$${key}`;
            const path = prefix ? `${prefix}.${key}` : key;
            const children = (root[storageKey] ??= {}) as Record<string, unknown>;
            const isBranch = value != null && typeof value === 'object'
                && Object.getPrototypeOf(value) === Object.prototype;

            if (isBranch) {
                addTranslations(children, value, language, path);
            } else {
                (cache[language] ??= {})[path] = value;
            }

            if (!Object.prototype.hasOwnProperty.call(root, key)) {
                Object.defineProperty(root, key, {
                    get() {
                        context.throwOnDisabled?.();
                        if (isBranch) {
                            return children;
                        }
                        const localized = cache[context.locale]?.[path];
                        if (localized != null) {
                            return localized;
                        }
                        for (const locale of context.fallbackLocales) {
                            const translation = cache[locale]?.[path];
                            if (translation != null) {
                                return translation;
                            }
                        }
                        return _throw(`$i18n: did not find key '${path}' for any locale`);
                    },
                });
            }
        }
    }

    for (const language of Object.values(LanguageKey)) {
        addTranslations(tree, messages[language] ?? {}, language, '');
    }

    return tree as T;
}
