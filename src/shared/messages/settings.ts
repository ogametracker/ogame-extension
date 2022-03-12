import { Settings } from "../models/v1/settings/Settings";
import { Message, NoDataMessage } from "./Message";
import { MessageType } from "./MessageType";

export type UpdateSettingsMessage = Message<MessageType.UpdateSettings, Settings>;
export type SettingsMessage = Message<MessageType.Settings, Settings>;
export type RequestSettingsMessage = NoDataMessage<MessageType.RequestSettings>;