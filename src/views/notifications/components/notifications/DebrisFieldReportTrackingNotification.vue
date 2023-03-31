<template>
    <notification type="info" :title="title" @remove="$emit('remove')" :timeout="10000">
        <template #message>
            <div v-text="message" />

            <template v-if="hasResources">
                <hr />
                <div class="resources-grid" v-if="showSimplified">
                    <template v-for="resource in ResourceTypes">
                        <template v-if="notification.resources[resource] > 0">
                            <o-resource :resource="resource" />
                            <span v-text="$i18n.$n(notification.resources[resource])"/>
                        </template>
                    </template>

                    <span class="mdi mdi-sigma" />
                    <span v-text="$i18n.$n(sum)" />
                </div>
                <div v-else class="text-grid">
                    <template v-for="resource in ResourceTypes">
                        <template v-if="notification.resources[resource] > 0">
                            <span v-text="$i18n.$t.extension.resources[resource]" />
                            <span v-text="$i18n.$n(notification.resources[resource])" />
                        </template>
                    </template>

                    <span v-text="$i18n.$t.extension.common.sum" />
                    <span v-text="$i18n.$n(sum)" />
                </div>
            </template>
        </template>
    </notification>
</template>

<script lang="ts">
    import { DebrisFieldReportTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
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
        private readonly ResourceTypes = ResourceTypes;

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

        private get hasResources() {
            return this.notification.resources.metal > 0 
                || this.notification.resources.crystal > 0
                || this.notification.resources.deuterium > 0;
        }
    }
</script>
<style lang="scss" scoped>
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