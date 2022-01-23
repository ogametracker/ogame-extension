import { add, startOfMonth, startOfWeek, startOfYear, sub } from "date-fns";
import startOfDay from "date-fns/startOfDay";

export type DateRangeType = 'day' | 'week' | 'month' | 'year';
export type FullDateRangeType = DateRangeType | 'all';

interface NormalDateRange {
    type: DateRangeType;
    skip: number;
    take: number;
    label: string;
}

interface AllDateRange {
    type: 'all';
    label?: undefined;
}

export type DateRange = NormalDateRange | AllDateRange;


export function getDaysInRange(range: DateRange): Date[] | null {
    const today = startOfDay(new Date());

    let start: Date;
    let end: Date;
    switch (range.type) {
        case 'day':
            start = sub(today, { days: range.skip });
            end = add(start, { days: range.take });
            break;

        case 'week':
            start = sub(startOfWeek(today, { locale: { code: 'de', options: { weekStartsOn: 1 }} }), { weeks: range.skip }); //TODO: locale from settings
            end = add(start, { weeks: range.take });
            break;

        case 'month':
            start = sub(startOfMonth(today), { months: range.skip });
            end = add(start, { months: range.take });
            break;

        case 'year':
            start = sub(startOfYear(today), { years: range.skip });
            end = add(start, { years: range.take });
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


export function isInRange(date: number | Date, range: DateRange): boolean {
    const days = getDaysInRange(range); //TODO: optimize by not computing all days in the range
    if (days == null)
        return true;

    const dateDay = startOfDay(date).getTime();
    return days.map(d => d.getTime()).includes(dateDay);
}