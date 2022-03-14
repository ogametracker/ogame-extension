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

type DateRange = NormalDateRange | AllDateRange;
export default DateRange;