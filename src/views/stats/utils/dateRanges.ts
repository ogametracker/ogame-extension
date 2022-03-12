import { addDays, addMonths, addWeeks, addYears, startOfMonth, startOfWeek, startOfYear, subDays, subMonths, subWeeks, subYears } from "date-fns";
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



export function isInRange(date: number | Date, range: DateRange): boolean {
    let firstRangeDayIncl: Date;
    let lastRangeDayExcl: Date;

    const today = startOfDay(Date.now());

    switch (range.type) {
        case 'all': return true;

        case 'day': {
            firstRangeDayIncl = subDays(today, range.skip);
            lastRangeDayExcl = addDays(firstRangeDayIncl, range.take);
            break;
        }

        case 'week': {
            const start = startOfWeek(Date.now(), { weekStartsOn: 1 });
            firstRangeDayIncl = subWeeks(start, range.skip);
            lastRangeDayExcl = addWeeks(firstRangeDayIncl, range.take);
            break;
        }

        case 'month': {
            const start = startOfMonth(Date.now());
            firstRangeDayIncl = subMonths(start, range.skip);
            lastRangeDayExcl = addMonths(firstRangeDayIncl, range.take);
            break;
        }

        case 'year': {
            const start = startOfYear(Date.now());
            firstRangeDayIncl = subYears(start, range.skip);
            lastRangeDayExcl = addYears(firstRangeDayIncl, range.take);
            break;
        }
    }

    const dayOfDate = startOfDay(date);
    return firstRangeDayIncl <= dayOfDate && lastRangeDayExcl > dayOfDate;
}