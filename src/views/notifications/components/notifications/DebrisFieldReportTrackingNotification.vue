<template>
    <notification
        type="info"
        :title="title"
        @remove="$emit('remove')"
        :timeout="10000"
    >
        <template #message>
            <div v-text="message" />

            <template
                v-if="
                    notification.resources.metal > 0 ||
                    notification.resources.crystal > 0
                "
            >
                <hr />
                <div class="resources-grid">
                    <o-resource resource="metal" />
                    <span
                        v-text="$i18n.$n(notification.resources.metal)"
                        :class="{ fade: notification.resources.metal == 0 }"
                    />

                    <o-resource resource="crystal" />
                    <span
                        v-text="$i18n.$n(notification.resources.crystal)"
                        :class="{ fade: notification.resources.crystal == 0 }"
                    />
                </div>
            </template>
        </template>
    </notification>
</template>

<script lang="ts">
    import { DebrisFieldReportTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';

    @Component({
        components: {
            Notification,
        }
    })
    export default class DebrisFieldReportTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: DebrisFieldReportTrackingNotificationMessageData;

        private get title() {
            return `LOCA: ${this.notification.count} debris fields tracked.`;
        }

        private get message() {
            return `LOCA: ${this.notification.count} debris fields were tracked.`;
        }
    }
</script>
<style lang="scss" scoped>
    .fade {
        color: rgba(white, 0.1);
    }

    .resources-grid {
        display: grid;
        grid-template-columns: repeat(2, 32px 1fr);
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;
    }
</style>