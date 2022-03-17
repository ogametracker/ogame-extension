export type DateRangeType = 'day' | 'week' | 'month' | 'year';
export type FullDateRangeType = DateRangeType | 'all';

export interface NormalDateRange {
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