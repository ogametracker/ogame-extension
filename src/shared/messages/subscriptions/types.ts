import { Message } from "../Message";
import { MessageType } from "../MessageType";

export type SubscriptionMessage = Message<MessageType.Subscribe, MessageType>;
export type UnsubscriptionMessage = Message<MessageType.Unsubscribe, MessageType>;