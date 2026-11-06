import { addDays, addMonths, addWeeks, addYears, startOfMonth, startOfWeek, startOfYear, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import startOfDay from 'date-fns/startOfDay';

import type { DateRange, NormalDateRange } from '@ogame-tracker/shared/models/settings/DateRange';

interface RangeDays {
    firstDay: Date;
    lastDay: Date;
}

export function getRangeDays(range: NormalDateRange): RangeDays;
export function getRangeDays(range: DateRange): RangeDays | null;
export function getRangeDays(range: DateRange): RangeDays | null {

    let firstRangeDayIncl: Date;
    let lastRangeDayExcl: Date;

    const today = startOfDay(Date.now());

    switch (range.type) {
    case 'all': return null;

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

    return {
        firstDay: firstRangeDayIncl,
        lastDay: subDays(lastRangeDayExcl, 1),
    };
}

export function isInRange(date: number | Date, range: DateRange): boolean {
    const rangeDays = getRangeDays(range);
    if (rangeDays == null) {
        return true;
    }

    const dayOfDate = startOfDay(date);
    return rangeDays.firstDay <= dayOfDate && rangeDays.lastDay >= dayOfDate;
}