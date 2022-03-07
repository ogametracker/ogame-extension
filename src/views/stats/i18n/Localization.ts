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

    public formatTimeSpan(valueInSeconds: number): string {
        let totalTime = BigInt(Math.ceil(valueInSeconds));

        const seconds = totalTime % 60n;
        totalTime = (totalTime - seconds) / 60n;

        const minutes = totalTime % 60n;
        totalTime = (totalTime - minutes) / 60n;

        const hours = totalTime % 24n;
        totalTime = (totalTime - hours) / 24n;

        const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (totalTime == 0n) {
            return time;
        }

        const days = totalTime % 7n;
        totalTime = (totalTime - days) / 7n;

        const timeWithDays = `${days}d ` + time;
        if (totalTime == 0n) {
            return timeWithDays;
        }

        const weeks = totalTime;

        return `${this.$number(Number(weeks))}w ` + timeWithDays;
    }
}

export const Localization = new LocalizationHelper();

