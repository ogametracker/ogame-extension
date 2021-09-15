import { I18n } from "./i18n";
import { I18nExtension } from './i18n/extension';
import { I18nOgame } from './i18n/ogame';
declare module 'vue/types/vue' {
    interface Vue {
        $extBase: string;
        $ogame: I18n<I18nOgame>;
        $extension: I18n<I18nExtension>;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        ogame: I18n<I18nOgame>;
        extension: I18n<I18nExtension>;
    }
}