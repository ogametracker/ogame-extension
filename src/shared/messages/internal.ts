import { NoDataMessage } from "./Message";
import { MessageType } from "./MessageType";

export type StayAliveMessage = NoDataMessage<MessageType.StayAlive>;

export type DropDatabaseConnectionsMessage = NoDataMessage<MessageType.DropDatabaseConnections>