import { ExpeditionFindableShipType } from "../models/expeditions/ExpeditionEvents";
import { ExpeditionEventType } from "../models/expeditions/ExpeditionEventType";
import { ResourceType } from "../models/ogame/resources/ResourceType";
import { Message } from "./Message";
import { MessageType } from "./MessageType";

export enum NotificationType {
    ExpeditionTracking = 'message-tracking/expeditions',
    ExpeditionTrackingLostFleet = 'message-tracking/expeditions/lost-fleet',
    MessageTrackingError = 'message-tracking/error',
}

export interface BasicNotificationData<T extends NotificationType> {
    messageId?: string;
    type: T;
}

export type NotificationMessage<TType extends NotificationType = NotificationType, TData extends {} = {}> = Message<MessageType.Notification, TData & BasicNotificationData<TType>>;

// notification messages for message tracking
export interface ExpeditionTrackingNotificationMessageData {
    resources: Record<ResourceType, number>;
    ships: Record<ExpeditionFindableShipType, number>;
    darkMatter: number;
    events: Record<ExpeditionEventType, number>;
}
export type ExpeditionTrackingNotificationMessage = NotificationMessage<NotificationType.ExpeditionTracking, ExpeditionTrackingNotificationMessageData>;
export type ExpeditionTrackingLostFleetNotificationMessage = NotificationMessage<NotificationType.ExpeditionTrackingLostFleet, { count: number }>;

export type MessageTrackingErrorNotificationMessage = NotificationMessage<NotificationType.MessageTrackingError, { count: number }>;