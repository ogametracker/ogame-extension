import { HexColor } from "@/utils/colors";
import BattleResult from "../battles/BattleResult";
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
    ships: ShipsChartColorSettings;
    battleResults: Record<BattleResult, HexColor>;
}

type OverviewChartColorSettings = Record<ExpoType, HexColor>;
type ResourcesChartColorSettings = Record<Resource, HexColor>;
type ShipsChartColorSettings = Record<Ship, HexColor>;

export default interface Settings {
    tables: TableSettings;
    charts: ChartSettings;
}