import extensionMessages from '@ogame-tracker/shared/i18n/extension';
import { createTranslationTree } from '@ogame-tracker/shared/i18n/extension/createTranslationTree';
import type { ExtensionTranslations } from '@ogame-tracker/shared/i18n/extension/type';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
import { useSettingsStore } from './stores/settings';

const messages = createTranslationTree<ExtensionTranslations>({
    get locale() {
        return useSettingsStore().settings?.extensionLanguage ?? LanguageKey.en;
    },
    fallbackLocales: [LanguageKey.en, LanguageKey.de],
}, extensionMessages);

export function translate<T>(select: (translations: ExtensionTranslations) => T): T {
    return select(messages);
}

export function formatNumber(value: number): string {
    const settings = useSettingsStore().settings;
    const language = settings?.extensionLanguage ?? LanguageKey.en;
    const region = settings?.extensionLanguageRegion;
    const locale = region == null ? language : `${language}-${region}`;
    return new Intl.NumberFormat(locale).format(value);
}
