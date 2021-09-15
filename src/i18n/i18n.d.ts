import Vue from 'vue';
import { I18n } from '.';
import { I18nExtension } from './extension';
import { I18nOgame } from './ogame';

declare module 'vue/types/vue' {
  interface Vue {
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