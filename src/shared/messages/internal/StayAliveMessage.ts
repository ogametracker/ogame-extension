import { NoDataMessage } from "../Message";
import { MessageType } from "../MessageType";

export interface StayAliveMessage extends NoDataMessage<MessageType.StayAlive> { }