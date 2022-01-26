import { LanguageKey } from '@/shared/i18n/LanguageKey';
import { Component, Vue } from 'vue-property-decorator';

@Component
class LocalizationHelper extends Vue {
    public language: LanguageKey = LanguageKey.de;
    private readonly defaultNumberFormatOptions: Intl.NumberFormatOptions = {
        maximumFractionDigits: 0,
    };

    public formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
        return new Intl.NumberFormat(this.language, options ?? this.defaultNumberFormatOptions).format(value);
    }

    public formatDate(value: number | Date): string {
        return new Intl.DateTimeFormat(this.language, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(value);
    }

    public formatTime(value: number | Date): string {
        return new Intl.DateTimeFormat(this.language, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(value);
    }

    public formatDateTime(value: number | Date): string {
        return `${this.formatDate(value)} ${this.formatTime(value)}`;
    }
}

export const Localization = new LocalizationHelper();

