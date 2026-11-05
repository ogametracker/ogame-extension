<template>
    <div ref="container" class="notification-list" :class="{ 'has-notifications': notifications.size > 0 }">
        <template v-for="[id, notification] in notifications" :key="id">
            <MessageTrackingErrorNotification
                v-if="notification.type === NotificationType.MessageTrackingError"
                :notification="notification" @remove="notifications.delete(id)"
            />
            <ExpeditionTrackingNotification
                v-else-if="notification.type === NotificationType.ExpeditionTracking"
                :notification="notification" @remove="notifications.delete(id)"
            />
            <ExpeditionTrackingLostFleetNotification
                v-else-if="notification.type === NotificationType.ExpeditionTrackingLostFleet"
                :notification="notification" @remove="notifications.delete(id)"
            />
            <CombatTrackingNotification
                v-else-if="notification.type === NotificationType.CombatTracking"
                :notification="notification" @remove="notifications.delete(id)"
            />
            <DebrisFieldReportTrackingNotification
                v-else-if="notification.type === NotificationType.DebrisFieldReportTracking"
                :notification="notification" @remove="notifications.delete(id)"
            />
            <LifeformDiscoveryTrackingNotification
                v-else-if="notification.type === NotificationType.LifeformDiscoveryTracking"
                :notification="notification" @remove="notifications.delete(id)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, ref, shallowReactive } from 'vue';
    import { v4 } from 'uuid';
    import { ogameTrackerNotificationWindowResizeEventName } from '@/shared/messages/communication';
    import { MessageType } from '@/shared/messages/MessageType';
    import { NotificationType } from '@/shared/messages/notifications';
    import type { MessageOgameMeta, NoDataMessage } from '@/shared/messages/Message';
    import type {
        CombatTrackingNotificationMessage,
        DebrisFieldReportTrackingNotificationMessage,
        ExpeditionTrackingLostFleetNotificationMessage,
        ExpeditionTrackingNotificationMessage,
        LifeformDiscoveryTrackingNotificationMessage,
        MessageTrackingErrorNotificationMessage,
    } from '@/shared/messages/notifications';
    import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
    import MessageTrackingErrorNotification from './components/notifications/MessageTrackingErrorNotification.vue';
    import ExpeditionTrackingNotification from './components/notifications/ExpeditionTrackingNotification.vue';
    import ExpeditionTrackingLostFleetNotification from './components/notifications/ExpeditionTrackingLostFleetNotification.vue';
    import CombatTrackingNotification from './components/notifications/CombatTrackingNotification.vue';
    import DebrisFieldReportTrackingNotification from './components/notifications/DebrisFieldReportTrackingNotification.vue';
    import LifeformDiscoveryTrackingNotification from './components/notifications/LifeformDiscoveryTrackingNotification.vue';

    type NotificationMessage =
        | CombatTrackingNotificationMessage
        | DebrisFieldReportTrackingNotificationMessage
        | ExpeditionTrackingLostFleetNotificationMessage
        | ExpeditionTrackingNotificationMessage
        | LifeformDiscoveryTrackingNotificationMessage
        | MessageTrackingErrorNotificationMessage;

    const { account } = defineProps<{ account: MessageOgameMeta }>();
    const container = ref<HTMLElement>();
    const notifications = shallowReactive(new Map<string, NotificationMessage['data']>());

    function onMessage(message: NoDataMessage<MessageType>) {
        if (message.type === MessageType.Notification && ogameMetasEqual(message.ogameMeta, account)) {
            const { data } = message as NotificationMessage;
            notifications.set(data.messageId ?? v4(), data);
        }
    }

    let resizeObserver: ResizeObserver | undefined;

    onMounted(() => {
        chrome.runtime.onMessage.addListener(onMessage);
        const element = container.value;
        if (element) {
            resizeObserver = new ResizeObserver(() => {
                window.parent.postMessage({
                    type: ogameTrackerNotificationWindowResizeEventName,
                    width: element.clientWidth,
                    height: element.clientHeight,
                }, '*');
            });
            resizeObserver.observe(element);
        }
    });

    onUnmounted(() => {
        chrome.runtime.onMessage.removeListener(onMessage);
        resizeObserver?.disconnect();
    });
</script>

<style lang="scss" scoped>
    .notification-list {
        width: max-content;
        display: grid;
        overflow: hidden;

        &.has-notifications {
            padding: 8px;
        }
    }
</style>
