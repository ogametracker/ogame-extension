<template>
    <Notification type="warning" :title="title" :message="message" :saturate="0.6" @remove="emit('remove')" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ExpeditionTrackingLostFleetNotificationMessage } from '@ogame-tracker/shared/messages/notifications';
import Notification from '../Notification.vue';
import { formatNumber, translate } from '../../i18n';

const { notification } = defineProps<{ notification: ExpeditionTrackingLostFleetNotificationMessage['data'] }>();
const emit = defineEmits<{ remove: [] }>();

const title = computed(() =>
    translate(t => t.extension.notifications.expeditionTracking.fleetLost.title(formatNumber(notification.count))),
);

const message = computed(() =>
    translate(t => t.extension.notifications.expeditionTracking.fleetLost.message(formatNumber(notification.count))),
);
</script>
