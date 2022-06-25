<template>
    <div id="app" :class="{ 'has-notifications': hasNotifications }">
        <component
            v-for="id in notificationOrder"
            :key="id"
            :is="componentNames[notifications[id].type]"
            :notification="notifications[id]"
            @remove="removeNotification(id)"
        />
    </div>
</template>

<script lang="ts">
    import { ogameTrackerNotificationWindowResizeEventName } from '@/shared/messages/communication';
    import { Message, MessageOgameMeta } from '@/shared/messages/Message';
    import { MessageType } from '@/shared/messages/MessageType';
    import { NotificationMessage, NotificationType } from '@/shared/messages/notifications';
    import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { _throw } from '@/shared/utils/_throw';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { v4 } from 'uuid';
    import MessageTrackingErrorNotification from './components/notifications/MessageTrackingErrorNotification.vue';
    import ExpeditionTrackingNotification from './components/notifications/ExpeditionTrackingNotification.vue';
    import ExpeditionTrackingLostFleetNotification from './components/notifications/ExpeditionTrackingLostFleetNotification.vue';
    import CombatTrackingNotification from './components/notifications/CombatTrackingNotification.vue';
    import DebrisFieldReportTrackingNotification from './components/notifications/DebrisFieldReportTrackingNotification.vue';

    @Component({
        components: {
            MessageTrackingErrorNotification,
            ExpeditionTrackingNotification,
            ExpeditionTrackingLostFleetNotification,
            CombatTrackingNotification,
            DebrisFieldReportTrackingNotification,
        },
    })
    export default class App extends Vue {
        private readonly componentNames: Record<NotificationType, string> = {
            [NotificationType.MessageTrackingError]: 'message-tracking-error-notification',
            [NotificationType.ExpeditionTracking]: 'expedition-tracking-notification',
            [NotificationType.ExpeditionTrackingLostFleet]: 'expedition-tracking-lost-fleet-notification',
            [NotificationType.CombatTracking]: 'combat-tracking-notification',
            [NotificationType.DebrisFieldReportTracking]: 'debris-field-report-tracking-notification',
        };

        private readonly notifications: Record<string, any & { type: NotificationType }> = {};
        private notificationOrder: string[] = [];

        private ogameMeta: MessageOgameMeta = {
            language: '',
            serverId: 0,
            playerId: 0,
        };

        @Watch('notificationOrder')
        private async onNotificationChanged() {
            await this.$nextTick();

            window.parent.postMessage({
                type: ogameTrackerNotificationWindowResizeEventName,
                width: this.$el.clientWidth,
                height: this.$el.clientHeight,
            }, '*');
        }

        private get hasNotifications() {
            return this.notificationOrder.length > 0;
        }

        private mounted() {
            document.querySelector('#splashscreen')?.remove();

            const params = new URLSearchParams(location.search);
            this.ogameMeta = {
                language: params.get('language') ?? _throw('expected language query parameter'),
                serverId: parseIntSafe(params.get('server') ?? _throw('expected server query parameter'), 10),
                playerId: parseIntSafe(params.get('player') ?? _throw('expected player query parameter'), 10),
            };


            chrome.runtime.onMessage.addListener(async message => await this.onMessage(message));
        }

        private async onMessage(message: Message<MessageType, any>) {
            if (message.type != MessageType.Notification) {
                return;
            }
            if (!ogameMetasEqual(message.ogameMeta, this.ogameMeta)) {
                return;
            }

            const msg = message as NotificationMessage;
            const messageId = msg.data.messageId ?? v4();
            if (!(messageId in this.notifications)) {
                this.notificationOrder.push(messageId);
            }

            this.notifications[messageId] = msg.data;
        }

        private removeNotification(id: string) {
            this.notificationOrder = this.notificationOrder.filter(n => n != id);
            delete this.notifications[id];
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        width: max-content;
        display: grid;
        overflow: hidden;

        &.has-notifications {
            padding: 8px;
        }
    }
</style>
