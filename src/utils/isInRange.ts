import { defaultLocale } from "@/i18n/defaults";
import DateRange from "@/models/settings/DateRange";
import { startOfDay, sub, add, startOfWeek, startOfMonth, isAfter, isBefore, isSameDay } from 'date-fns';

export default function isInRange(date: number | Date, range: DateRange): boolean {
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

        case 'all': return true;
        default: throw new Error();
    }

    const x = (isAfter(date, start) || isSameDay(date, start)) && isBefore(date, end);
    return x;
}