<template>
    <div id="app" :class="{ 'has-notifications': hasNotifications }">
        <component
            v-for="(notification, id) in notifications"
            :key="id"
            :is="componentNames[notification.type]"
            :notification="notification"
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
    import ExpeditionTrackingNotification from './components/notifications/ExpeditionTrackingNotification.vue';

    @Component({
        components: {
            ExpeditionTrackingNotification,
        }
    })
    export default class App extends Vue {
        private readonly componentNames: Record<NotificationType, string> = {
            [NotificationType.ExpeditionTracking]: 'expedition-tracking-notification',
            [NotificationType.MessageTrackingError]: 'todo', //TODO: proper component name
        };

        private readonly notifications: Record<string, any & { type: NotificationType }> = {};
        private ogameMeta: MessageOgameMeta = {
            language: '',
            serverId: 0,
            playerId: 0,
        }

        @Watch('notifications', { deep: true })
        private async onNotificationChanged() {
            await this.$nextTick();

            window.parent.postMessage({
                type: ogameTrackerNotificationWindowResizeEventName,
                width: this.$el.clientWidth,
                height: this.$el.clientHeight,
            }, '*');
        }

        private get hasNotifications() {
            return Object.keys(this.notifications).length > 0;
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
            this.$set(this.notifications, msg.data.messageId ?? v4(), msg.data);
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        width: max-content;
        display: grid;
        row-gap: 16px;

        &.has-notifications {
            padding: 8px;
        }
    }
</style>
