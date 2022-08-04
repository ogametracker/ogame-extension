import { ExpeditionDepletionLevel } from "../models/expeditions/ExpeditionDepletionLevel";
import { ExpeditionFindableShipType } from "../models/expeditions/ExpeditionEvents";
import { ExpeditionEventType } from "../models/expeditions/ExpeditionEventType";
import { ItemHash } from "../models/ogame/items/ItemHash";
import { ResourceType } from "../models/ogame/resources/ResourceType";
import { Message } from "./Message";
import { MessageType } from "./MessageType";

export enum NotificationType {
    ExpeditionTracking = 'message-tracking/expeditions',
    ExpeditionTrackingLostFleet = 'message-tracking/expeditions/lost-fleet',
    MessageTrackingError = 'message-tracking/error',
    CombatTracking = 'message-tracking/combats',
    DebrisFieldReportTracking = 'message-tracking/debris-field-reports',
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
    items: ItemHash[];
    events: Record<ExpeditionEventType, number>;
    depletion: Record<ExpeditionDepletionLevel | 'unknown', number>;
}
export type ExpeditionTrackingNotificationMessage = NotificationMessage<NotificationType.ExpeditionTracking, ExpeditionTrackingNotificationMessageData>;
export type ExpeditionTrackingLostFleetNotificationMessage = NotificationMessage<NotificationType.ExpeditionTrackingLostFleet, { count: number }>;

export interface CombatTrackingNotificationMessageData {
    count: number;
    resources: Record<ResourceType, number>;
}
export type CombatTrackingNotificationMessage = NotificationMessage<NotificationType.CombatTracking, CombatTrackingNotificationMessageData>;

export interface DebrisFieldReportTrackingNotificationMessageData {
    count: number;
    resources: Record<Exclude<ResourceType, ResourceType.deuterium>, number>;
}
export type DebrisFieldReportTrackingNotificationMessage = NotificationMessage<NotificationType.DebrisFieldReportTracking, DebrisFieldReportTrackingNotificationMessageData>;

export type MessageTrackingErrorNotificationMessage = NotificationMessage<NotificationType.MessageTrackingError, { count: number }>;