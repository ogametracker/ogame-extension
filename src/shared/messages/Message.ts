import { MessageType } from "./MessageType";

export interface MessageOgameMeta {
    serverId: number;
    language: string;
    playerId: number;
}

export interface Message<TType extends MessageType = MessageType, TData = any> {
    type: TType;
    ogameMeta: MessageOgameMeta;
    data: TData;
}