import { UniverseHistory } from '../../models/universe-history/UniverseHistory';
import { Message, NoDataMessage } from '../Message';
import { MessageType } from '../MessageType';

export type RequestUniverseHistoryMessage = NoDataMessage<MessageType.RequestUniverseHistoryData>;
export type NotifyUniverseHistoryUpdateMessage = Message<MessageType.NotifyUniverseHistoryUpdate, UniverseHistory>;
export type UniverseHistoryDataMessage = Message<MessageType.UniverseHistoryData, UniverseHistory>;