import { I18n } from "@/shared/i18n/extension/$i18n";
import { ExtensionTranslationsFull } from "@/shared/i18n/extension/type";
import { LanguageKey } from "@/shared/i18n/LanguageKey";

// augment Vue type with localization stuff
declare module 'vue/types/vue' {
    interface Vue {
        $forceCompute(name: string): void;
        get $lang(): LanguageKey;
        get $i18n(): I18n<ExtensionTranslationsFull, Intl.DateTimeFormatOptions>;
    }
}