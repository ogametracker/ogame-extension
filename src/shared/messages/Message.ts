import { MessageType } from "./MessageType";

export interface MessageOgameMeta {
    serverId: number;
    language: string;
    playerId: number;
}

export interface Message<TType extends MessageType, TData> {
    type: TType;
    ogameMeta: MessageOgameMeta;
    data: TData;
}