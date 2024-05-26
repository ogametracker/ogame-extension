import { Message } from '../Message';
import { MessageType } from '../MessageType';
import { RawMessageDataV11 } from './common';
import { DebrisFieldReport } from '../../models/debris-field-reports/DebrisFieldReport';

export type TrackDebrisFieldReportMessage = Message<MessageType.TrackDebrisFieldReport, RawMessageDataV11>;
export type TrackManualDebrisFieldReportMessage = Message<MessageType.TrackManualDebrisFieldReport, DebrisFieldReport>;
export type DebrisFieldReportMessage = Message<MessageType.DebrisFieldReport, DebrisFieldReport>;
export type NewDebrisFieldReportMessage = Message<MessageType.NewDebrisFieldReport, DebrisFieldReport>;