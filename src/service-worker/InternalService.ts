import { dropDatabaseConnections } from "@ogame-tracker/shared/db/access";
import { Message } from "@ogame-tracker/shared/messages/Message";
import { MessageType } from "@ogame-tracker/shared/messages/MessageType";
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