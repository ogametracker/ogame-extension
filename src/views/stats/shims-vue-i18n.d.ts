import { I18n } from "@stats/i18n";
import { ExtensionTranslationsFull } from "@ogame-tracker/shared/i18n/extension/type";
import { LanguageKey } from "@ogame-tracker/shared/i18n/LanguageKey";

// augment Vue type with localization stuff
declare module 'vue/types/vue' {
    interface Vue {
        $forceCompute(name: string): void;
        get $lang(): LanguageKey;
        get $i18n(): I18n<ExtensionTranslationsFull, Intl.DateTimeFormatOptions>;
    }
}