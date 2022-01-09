import { Message } from "../Message";
import { MessageType } from "../MessageType";

export interface TrackExpeditionMessageData {
    id: number;
    date: number;
    text: string;
    html: string;
}

export type TrackExpeditionMessage = Message<MessageType.TrackExpedition, TrackExpeditionMessageData>;