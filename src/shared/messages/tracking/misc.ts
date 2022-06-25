import { Message } from "../Message";
import { MessageType } from "../MessageType";

export type MessageTrackingErrorType = 'expedition' | 'combat-report' | 'debris-field-report';
export type WillNotBeTrackedMessage = Message<MessageType.WillNotBeTracked, {
    type: MessageTrackingErrorType;
    id: number;
}>;

export type MessageTrackingErrorMessage = Message<MessageType.TrackingError, {
    type: MessageTrackingErrorType;
    id: number;
}>;