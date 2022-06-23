import { ExpeditionFindableShipType } from "../models/expeditions/ExpeditionEvents";
import { ExpeditionEventType } from "../models/expeditions/ExpeditionEventType";
import { ResourceType } from "../models/ogame/resources/ResourceType";
import { Message } from "./Message";
import { MessageType } from "./MessageType";

export type NotificationLevel = 'info' | 'success' | 'warning' | 'error';
export enum NotificationType {
    ExpeditionTracking = 'message-tracking/expeditions',
    MessageTrackingError = 'message-tracking/error',
}

export interface BasicNotificationData {
    messageId?: string;
    level: NotificationLevel;
    type: NotificationType;

    /** if not defined, notification will be visible until closed manually*/
    timeout?: number;
}

export type NotificationMessage<TData extends {} = {}> = Message<MessageType.Notification, TData & BasicNotificationData>;

// notification messages for message tracking
export interface ExpeditionTrackingNotificationMessageData {
    waiting: number;
    resources: Record<ResourceType, number>;
    ships: Record<ExpeditionFindableShipType, number>;
    darkMatter: number;
    events: Record<ExpeditionEventType, number>;
}
export type ExpeditionTrackingNotificationMessage = NotificationMessage<ExpeditionTrackingNotificationMessageData>;

export type MessageTrackingErrorNotificationMessage = NotificationMessage<{ count: number }>;