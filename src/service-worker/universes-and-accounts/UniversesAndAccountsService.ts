import { getGlobalDatabase } from "@/shared/db/access";
import { Message } from "@/shared/messages/Message";
import { MessageType } from "@/shared/messages/MessageType";
import { UpdatePlayerNameMessage, UpdateUniverseNameMessage } from "@/shared/messages/tracking/empire";
import { MessageService } from "../MessageService";

export class UniversesAndAccountsService implements MessageService {
    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch(message.type) {
            case MessageType.UpdatePlayerName: {
                const msg = message as UpdatePlayerNameMessage;
                const db = await getGlobalDatabase();
                await db.put('accounts', {
                    id: message.ogameMeta.playerId,
                    serverId: message.ogameMeta.serverId,
                    serverLanguage: message.ogameMeta.language,
                    name: msg.data,
                });
                break;
            }

            case MessageType.UpdateUniverseName: {
                const msg = message as UpdateUniverseNameMessage;
                const db = await getGlobalDatabase();
                await db.put('servers', {
                    id: message.ogameMeta.serverId,
                    language: message.ogameMeta.language,
                    name: msg.data,
                });
                break;
            }
        }
    }
}

            