import { LanguageKey } from '@/shared/i18n/LanguageKey';
import { Component, Vue } from 'vue-property-decorator';

@Component
class LocalizationHelper extends Vue {
    private _locale: LanguageKey = LanguageKey.de;

    //TODO: expose in vue components as $number
    public get numberFormatter(): Intl.NumberFormat {
        return new Intl.NumberFormat(this._locale, {
            maximumFractionDigits: 3,
        });
    }

    //TODO: expose in vue components as $date
    public get dateFormatter(): Intl.DateTimeFormat {
        return new Intl.DateTimeFormat(this._locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }
}

export const Localization = new LocalizationHelper();