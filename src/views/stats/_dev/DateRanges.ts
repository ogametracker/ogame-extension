import { DateRange } from "../utils/dateRanges";

export const _dev_DateRanges: DateRange[] = [
    {
        skip: 0,
        take: 1,
        type: 'day',
        label: 'Heute',
    },
    {
        skip: 1,
        take: 1,
        type: 'day',
        label: 'Gestern',
    },
    {
        skip: 2,
        take: 1,
        type: 'day',
        label: 'Vorgstern',
    },
    {
        skip: 0,
        take: 1,
        type: 'week',
        label: 'Aktuelle Woche',
    },
    {
        skip: 1,
        take: 1,
        type: 'week',
        label: 'Letzte Woche',
    },
    {
        skip: 0,
        take: 1,
        type: 'month',
        label: 'Aktueller Monat',
    },
    {
        skip: 1,
        take: 1,
        type: 'month',
        label: 'Letzter Monat',
    },
    {
        skip: 0,
        take: 1,
        type: 'year',
        label: 'Aktuelles Jahr',
    },
    {
        skip: 1,
        take: 1,
        type: 'year',
        label: 'Letztes Jahr',
    },
    {
        type: 'all',
    },
];