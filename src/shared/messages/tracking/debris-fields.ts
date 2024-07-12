import { Message } from '../Message';
import { MessageType } from '../MessageType';
import { DebrisFieldReport } from '../../models/debris-field-reports/DebrisFieldReport';
import { Coordinates } from '@/shared/models/ogame/common/Coordinates';

export interface RawDebrisFieldMessageData {
    id: number;
    date: number;
    coords: Coordinates;
    resources: {
        metal: number;
        crystal: number;
        deuterium: number;
    };
}

export type TrackDebrisFieldReportMessage = Message<MessageType.TrackDebrisFieldReport, RawDebrisFieldMessageData>;
export type TrackManualDebrisFieldReportMessage = Message<MessageType.TrackManualDebrisFieldReport, DebrisFieldReport>;
export type DebrisFieldReportMessage = Message<MessageType.DebrisFieldReport, DebrisFieldReport>;
export type NewDebrisFieldReportMessage = Message<MessageType.NewDebrisFieldReport, DebrisFieldReport>;