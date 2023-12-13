import { MessageType } from './MessageType';

export interface MessageOgameMeta {
    serverId: number;
    language: string;
    userLanguage: string;
    playerId: number;
}

export interface NoDataMessage<TType extends MessageType> {
    type: TType;
    ogameMeta: MessageOgameMeta;
    senderUuid: string;
}

export interface Message<TType extends MessageType = MessageType, TData = any> extends NoDataMessage<TType> {
    data: TData;
}