interface NormalDateRange {
    type: 'day' | 'week' | 'month';
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