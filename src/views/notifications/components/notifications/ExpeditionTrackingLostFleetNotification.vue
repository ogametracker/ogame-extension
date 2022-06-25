<template>
    <notification
        type="warning"
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
    import ExpeditionEventResourcesIcon from '@/views/_shared/components/ExpeditionEventResourcesIcon.vue';

    @Component({
        components: {
            Notification,
            ExpeditionEventResourcesIcon,
        }
    })
    export default class ExpeditionTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: MessageTrackingErrorNotificationMessage['data'];

        private get title() {
            return `LOCA: ${this.notification.count} fleets lost.`;
        }

        private get message() {
            return `LOCA: ${this.notification.count} fleets did not return from their expeditions.`;
        }
    }
</script>