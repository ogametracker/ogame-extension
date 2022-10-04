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
            return this.$i18n.$t.extension.notifications.messageTrackingError.title(this.$i18n.$n(this.notification.count));
        }

        private get message() {
            return this.$i18n.$t.extension.notifications.messageTrackingError.message(this.$i18n.$n(this.notification.count));
        }
    }
</script>