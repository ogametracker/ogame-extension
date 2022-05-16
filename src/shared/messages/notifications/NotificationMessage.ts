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

export type NewNotificationMessage = Message<MessageType.NewNotification, NotificationData>;