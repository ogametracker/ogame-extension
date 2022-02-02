import { Message } from "../shared/messages/Message";
import { MessageType } from "../shared/messages/MessageType";

export interface MessageService {
    onMessage(message: Message<MessageType, any>): Promise<void>;
}