import DateRange from "@/models/settings/DateRange";
import { startOfDay } from 'date-fns';
import daysInRange from "./daysInRange";

export default function isInRange(date: number | Date, range: DateRange): boolean {
    const days = daysInRange(range);
    if (days == null)
        return true;

    const dateDay = startOfDay(date).getTime();
    return days.map(d => d.getTime()).includes(dateDay);
}

