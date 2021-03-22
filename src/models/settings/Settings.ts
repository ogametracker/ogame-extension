import { HexColor } from "@/utils/colors";
import ExpoType from "../expeditions/ExpoType";
import Resource from "../Resource";
import Ship from "../Ship";
import DateRange from "./DateRange";

interface TableSettings {
    ranges: DateRange[];
}

interface ChartSettings {
    days: number;
    colors: ChartColorSettings;
}

interface ChartColorSettings {
    overview: OverviewChartColorSettings;
    resources: ResourcesChartColorSettings;
    fleet: FleetChartColorSettings;
    darkMatter: HexColor;
}

type OverviewChartColorSettings = Record<ExpoType, HexColor>;
type ResourcesChartColorSettings = Record<Resource, HexColor>;
type FleetChartColorSettings = Record<Ship, HexColor | undefined>;

export default interface Settings {
    tables: TableSettings;
    charts: ChartSettings;
}