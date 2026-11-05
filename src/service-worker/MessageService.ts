import { Message } from "@ogame-tracker/shared/messages/Message";
import { MessageType } from "@ogame-tracker/shared/messages/MessageType";

export interface MessageService {
    onMessage(message: Message<MessageType, any>): Promise<void>;
}