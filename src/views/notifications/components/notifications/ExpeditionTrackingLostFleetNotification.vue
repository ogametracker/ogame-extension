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
    import { ExpeditionTrackingLostFleetNotificationMessage } from '@/shared/messages/notifications';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';

    @Component({
        components: {
            Notification,
        }
    })
    export default class ExpeditionTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: ExpeditionTrackingLostFleetNotificationMessage['data'];

        private get title() {
            return this.$i18n.$t.extension.notifications.expeditionTracking.fleetLost.title(this.$i18n.$n(this.notification.count));
        }

        private get message() {
            return this.$i18n.$t.extension.notifications.expeditionTracking.fleetLost.message(this.$i18n.$n(this.notification.count));
        }
    }
</script>