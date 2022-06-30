import { dropDatabaseConnections } from "@/shared/db/access";
import { Message } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { MessageService } from "./MessageService";

export class InternalService implements MessageService {
    async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch(message.type) {
            case MessageType.StayAlive: {
                break;
            }

            case MessageType.DropDatabaseConnections: {
                dropDatabaseConnections();
                break;
            }
        }
    }
}