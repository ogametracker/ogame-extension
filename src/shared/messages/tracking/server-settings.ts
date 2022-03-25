import { ServerSettings } from '@/shared/models/server-settings/ServerSettings';
import { Message, NoDataMessage } from '../Message';
import { MessageType } from '../MessageType';

export type RequestServerSettingsMessage = NoDataMessage<MessageType.RequestServerSettingsData>;
export type NotifyServerSettingsUpdateMessage = Message<MessageType.NotifyServerSettingsUpdate, ServerSettings>;
export type ServerSettingsDataMessage = Message<MessageType.ServerSettingsData, ServerSettings>;