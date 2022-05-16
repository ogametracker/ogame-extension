import { Message } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { getStorageKeyPrefix } from "@/shared/utils/getStorageKeyPrefix";
import { MessageService } from "./MessageService";
import { getDatabase } from "./PersistentData";

export class KeepAliveService implements MessageService {
    async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch(message.type) {
            case MessageType.StayAlive: {
                await getDatabase(getStorageKeyPrefix(message.ogameMeta));
                break;
            }
        }
    }
}