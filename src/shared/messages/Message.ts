import { MessageType } from "./MessageType";

export interface MessageOgameMeta {
    serverId: number;
    language: string;
    playerId: number;
}

export interface NoDataMessage<TType extends MessageType> {
    type: TType;
    ogameMeta: MessageOgameMeta;
}

export interface Message<TType extends MessageType = MessageType, TData = any> extends NoDataMessage<TType> {
    data: TData;
}