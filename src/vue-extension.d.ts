import { I18n } from "./i18n";

declare module 'vue/types/vue' {
    interface Vue {
        $extBase: string;
        $i18n: I18n;
    }
}