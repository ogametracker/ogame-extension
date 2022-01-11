import { MessageType } from "./MessageType";

export interface MessageOgameMeta {
    server: string;
    playerId: number;
}

export interface Message<TType extends MessageType, TData> {
    type: TType;
    ogameMeta: MessageOgameMeta;
    data: TData;
}