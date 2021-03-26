import { Component, Vue } from 'vue-property-decorator';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationData {
    title: string;
    text: string;
    type: NotificationType;
    timeout?: number;
}

interface Notification extends NotificationData {
    id: number;
    hidden: boolean;
}

@Component({})
class NotificationModule extends Vue {
    private readonly fadeOutTime = 250;

    private readonly notificationsInternal: Notification[] = [];
    private nextId = 0;

    public get notifications(): Notification[] {
        return this.notificationsInternal;
    }

    public addNotification(notification: NotificationData): Notification {
        const id = this.nextId++;
        const noti: Notification = {
            ...notification,
            id,
            hidden: false,
        };
        this.notificationsInternal.push(noti);

        if (notification.timeout != null) {
            setTimeout(() => this.remove(noti), notification.timeout);
        }

        return noti;
    }

    public remove(notification: Notification) {
        notification.hidden = true;

        setTimeout(() => {
            const index = this.notificationsInternal.findIndex(noti => noti == notification);
            if (index < 0)
                return;

            this.notificationsInternal.splice(index, 1);
        }, this.fadeOutTime);
    }
}

export default new NotificationModule();