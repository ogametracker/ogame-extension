import { Message } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { MessageService } from "./MessageService";

export class KeepAliveService implements MessageService {
    async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch(message.type) {
            case MessageType.StayAlive: {
                break;
            }
        }
    }
}