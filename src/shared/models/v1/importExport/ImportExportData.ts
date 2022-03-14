import BattleReport from "../battles/BattleReport";
import DebrisFieldReport from "../debrisFields/DebrisFieldReport";
import ExpoEvent from "../expeditions/ExpoEvent";
import Settings from "../settings/Settings";

export default interface ImportExportData {
    combats: BattleReport[];
    expeditions: ExpoEvent[];
    debrisFields: DebrisFieldReport[];
    settings: Settings;
}