import { defaultLocale } from "@/i18n/defaults";
import DateRange from "@/models/settings/DateRange";
import { startOfDay, sub, add, startOfWeek, startOfMonth } from 'date-fns';

export default function daysInRange(range: DateRange): Date[] | null {
    const today = startOfDay(new Date());

    let start: Date;
    let end: Date;
    switch (range.type) {
        case 'day':
            start = sub(today, { days: range.skip });
            end = add(start, { days: range.take });
            break;

        case 'week':
            start = sub(startOfWeek(today, { locale: defaultLocale }), { weeks: range.skip });
            end = add(start, { weeks: range.take });
            break;

        case 'month':
            start = sub(startOfMonth(today), { months: range.skip });
            end = add(start, { months: range.take });
            break;

        case 'all': return null;
        default: throw new Error();
    }

    const days: Date[]= [];
    let date = start;
    while(date < end) {
        days.push(date);
        date = add(date, { days: 1});
    }

    return days;
}