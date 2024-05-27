import { Message } from '../Message';
import { MessageType } from '../MessageType';
import { RawDebrisFieldMessageData } from './common';
import { DebrisFieldReport } from '../../models/debris-field-reports/DebrisFieldReport';

export type TrackDebrisFieldReportMessage = Message<MessageType.TrackDebrisFieldReport, RawDebrisFieldMessageData>;
export type TrackManualDebrisFieldReportMessage = Message<MessageType.TrackManualDebrisFieldReport, DebrisFieldReport>;
export type DebrisFieldReportMessage = Message<MessageType.DebrisFieldReport, DebrisFieldReport>;
export type NewDebrisFieldReportMessage = Message<MessageType.NewDebrisFieldReport, DebrisFieldReport>;