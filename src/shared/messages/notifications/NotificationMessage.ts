import { Message } from "../Message";
import { MessageType } from "../MessageType";

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationData {
    title: string;
    text: string;
    type: NotificationType;

    /** if not defined, notification will be visible until closed manually*/
    timeout?: number;
}

export interface Notification extends NotificationData {
    id: number;
}

/** message from content script to service worker */
export type CreateNotificationMessage = Message<MessageType.CreateNotification, NotificationData>;

/** message from service worker to notification view */
export type ShowNotificationMessage = Message<MessageType.ShowNotification, Notification>;
/** message from service worker to notification view */
export type HideNotificationMessage = Message<MessageType.HideNotification, Notification>;