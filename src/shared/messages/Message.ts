import { MessageType } from "./MessageType";

export interface Message<TType extends MessageType, TData> {
    type: TType;
    data: TData;
}