import Vue from 'vue';
import { Localization } from './Localization';

// augment Vue type with localization stuff
declare module 'vue/types/vue' {
    interface Vue {
        $number(value: number, options?: Intl.NumberFormatOptions): string;
        $date(value: number | Date): string;
        $time(value: number | Date): string;
        $datetime(value: number | Date): string;
        $timespan(valueInSeconds: number): string;
    }
}

Vue.prototype.$number = (value: number, options?: Intl.DateTimeFormatOptions) => Localization.formatNumber(value, options);
Vue.prototype.$date = (value: number | Date) => Localization.formatDate(value);
Vue.prototype.$time = (value: number | Date) => Localization.formatTime(value);
Vue.prototype.$datetime = (value: number | Date) => Localization.formatDateTime(value);
Vue.prototype.$timespan = (value: number) => Localization.formatTimeSpan(value);