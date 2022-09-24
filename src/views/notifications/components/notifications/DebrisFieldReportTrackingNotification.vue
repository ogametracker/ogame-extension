<template>
    <notification type="info" :title="title" @remove="$emit('remove')" :timeout="10000">
        <template #message>
            <div v-text="message" />

            <template v-if="notification.resources.metal > 0 || notification.resources.crystal > 0">
                <hr />
                <div class="resources-grid" v-if="showSimplified">
                    <o-resource resource="metal" />
                    <span v-text="$i18n.$n(notification.resources.metal)" :class="{ fade: notification.resources.metal == 0 }" />

                    <o-resource resource="crystal" />
                    <span v-text="$i18n.$n(notification.resources.crystal)" :class="{ fade: notification.resources.crystal == 0 }" />

                    <span class="mdi mdi-sigma" />
                    <span v-text="$i18n.$n(sum)" />
                </div>
                <div v-else class="text-grid">
                    <span v-text="$i18n.$t.extension.resources[ResourceType.metal]" />
                    <span :class="{ fade: notification.resources.metal == 0 }" v-text="$i18n.$n(notification.resources.metal)" />

                    <span v-text="$i18n.$t.extension.resources[ResourceType.crystal]" />
                    <span :class="{ fade: notification.resources.crystal == 0 }" v-text="$i18n.$n(notification.resources.crystal)" />

                    <span v-text="$i18n.$t.extension.common.sum" />
                    <span :class="{ fade: sum == 0 }" v-text="$i18n.$n(sum)" />
                </div>
            </template>
        </template>
    </notification>
</template>

<script lang="ts">
    import { DebrisFieldReportTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
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

        private readonly ResourceType = ResourceType;

        private get showSimplified() {
            return SettingsDataModule.settings.messageTracking.showSimplifiedResults;
        }

        private get title() {
            return this.$i18n.$t.extension.notifications.debrisFieldReportTracking.title(this.$i18n.$n(this.notification.count));
        }

        private get message() {
            return this.$i18n.$t.extension.notifications.debrisFieldReportTracking.message(this.$i18n.$n(this.notification.count));
        }

        private get sum() {
            return this.notification.resources.metal + this.notification.resources.crystal;
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

        .mdi {
            transform: scale(1.5);
            width: 24px;
            text-align: center;
            height: 20px;
        }

        .mdi,
        .o-resource {
            justify-self: center;
        }
    }

    .text-grid {
        display: grid;
        grid-template-columns: auto fr;
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;
    }
</style>