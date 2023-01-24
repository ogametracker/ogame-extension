import { broadcastMessage } from "@/shared/communication/broadcastMessage";
import { Message } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { serviceWorkerUuid } from "@/shared/uuid";
import { MessageService } from "../MessageService";

// fix for missing notifications and other messages in FF
export class ReBroadcastService implements MessageService {
    async onMessage(message: Message<MessageType, any>): Promise<void> {
        if (message.senderUuid != serviceWorkerUuid) {
            broadcastMessage(message);
        }
    }
}