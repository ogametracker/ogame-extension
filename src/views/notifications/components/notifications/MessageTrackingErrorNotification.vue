<template>
    <Notification
        type="error"
        :title="title"
        :message="message"
        :saturate="0.6"
        @remove="emit('remove')"
    />
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { MessageTrackingErrorNotificationMessage } from '@ogame-tracker/shared/messages/notifications';
    import Notification from '../Notification.vue';
    import { formatNumber, translate } from '../../i18n';

    const { notification } = defineProps<{ notification: MessageTrackingErrorNotificationMessage['data'] }>();
    const emit = defineEmits<{ remove: [] }>();

    const title = computed(() => translate(t => t.extension.notifications.messageTrackingError.title(formatNumber(notification.count))));

    const message = computed(() => translate(t => t.extension.notifications.messageTrackingError.message(formatNumber(notification.count))));
</script>