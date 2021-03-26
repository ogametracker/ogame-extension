import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $i18n: any;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
      i18n?: any;
  }
}