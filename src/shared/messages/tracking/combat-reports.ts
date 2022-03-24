import { CombatReport } from '../../models/combat-reports/CombatReport';
import { Message, NoDataMessage } from '../Message';
import { MessageType } from '../MessageType';
import { OgameCombatReport } from '../../models/ogame/combats/OgameCombatReport';

export interface RawCombatReportData {
    id: number;
    date: number;
    ogameCombatReport: OgameCombatReport;
}

export type TrackCombatReportMessage = Message<MessageType.TrackCombatReport, RawCombatReportData>;
export type CombatReportMessage = Message<MessageType.CombatReport, CombatReport>;
export type NewCombatReportMessage = Message<MessageType.NewCombatReport, CombatReport>;
export type AllCombatReportsMessage = Message<MessageType.AllCombatReports, CombatReport[]>;
export type RequestCombatReportsMessage = NoDataMessage<MessageType.RequestCombatReports>;