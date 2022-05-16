import { Message } from "../Message";
import { MessageType } from "../MessageType";

export type WillNotBeTrackedMessage = Message<MessageType.WillNotBeTracked, number>;
export type MessageTrackingErrorMessage = Message<MessageType.TrackingError, number>;