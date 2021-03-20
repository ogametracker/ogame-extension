import DateRange from "./DateRange";

interface TableSettings {
    ranges: DateRange[];
    showPercentage: boolean;
}

interface ChartSettings {
    days: number;
}

export default interface Settings {
    tables: TableSettings;
    charts: ChartSettings;
}