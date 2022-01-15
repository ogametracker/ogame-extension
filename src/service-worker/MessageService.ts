import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";

export interface MessageServiceEventInfo {
    sender: chrome.runtime.Port;
    broadcast: (message: Message<MessageType, any>, ...includePorts: chrome.runtime.Port[]) => void;
}

export interface MessageService {
    onMessage(message: Message<MessageType, any>, info: MessageServiceEventInfo): Promise<void>;
}