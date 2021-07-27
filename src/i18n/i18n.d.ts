import Vue from 'vue';
import { I18n } from '.';

declare module 'vue/types/vue' {
  interface Vue {
    $i18n: I18n;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
      i18n?: I18n;
  }
}