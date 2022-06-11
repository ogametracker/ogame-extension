import { Settings } from '../models/settings/Settings';
import { Message, NoDataMessage } from './Message';
import { MessageType } from './MessageType';

export type SettingsMessage = Message<MessageType.Settings, Settings>;
export type RequestSettingsMessage = NoDataMessage<MessageType.RequestSettings>;
export type NotifySettingsUpdateMessage = NoDataMessage<MessageType.NotifySettingsUpdate>;