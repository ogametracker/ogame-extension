<template>
    <notification
        type="error"
        :title="title"
        :message="message"
        :saturate="0.6"
        @remove="$emit('remove')"
    />
</template>

<script lang="ts">
    import { MessageTrackingErrorNotificationMessage } from '@/shared/messages/notifications';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';

    @Component({
        components: {
            Notification,
        }
    })
    export default class MessageTrackingErrorNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: MessageTrackingErrorNotificationMessage['data'];

        private get title() {
            return `LOCA: Tracking failed for ${this.notification.count} messages`;
        }

        private get message() {
            return `LOCA: ${this.notification.count} messages caused an error and have not been tracked. The causing messages have been marked in red. Please contact the developer.`;
        }
    }
</script>