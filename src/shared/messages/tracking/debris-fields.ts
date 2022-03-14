import { Message, NoDataMessage } from "../Message";
import { MessageType } from "../MessageType";
import { RawMessageData } from "./common";
import { DebrisFieldReport } from '../../models/v2/debris-field-reports/DebrisFieldReport';

export type TrackDebrisFieldReportMessage = Message<MessageType.TrackDebrisFieldReport, RawMessageData>;
export type DebrisFieldReportMessage = Message<MessageType.DebrisFieldReport, DebrisFieldReport>;
export type NewDebrisFieldReportMessage = Message<MessageType.NewDebrisFieldReport, DebrisFieldReport>;
export type AllDebrisFieldReportsMessage = Message<MessageType.AllDebrisFieldReports, DebrisFieldReport[]>;
export type RequestDebrisFieldReportsMessage = NoDataMessage<MessageType.RequestDebrisFieldReports>;