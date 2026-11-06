<template>
    <Notification type="info" :title="title" @remove="emit('remove')" :timeout="10000">
        <template #message>
            <div v-text="message" />

            <template v-if="hasResources">
                <hr />
                <div class="resources-grid" v-if="showSimplified">
                    <template v-for="resource in ResourceTypes" :key="resource">
                        <template v-if="notification.resources[resource] > 0">
                            <OResource :resource="resource" />
                            <span v-text="formatNumber(notification.resources[resource])"/>
                        </template>
                    </template>

                    <span class="mdi mdi-sigma" />
                    <span v-text="formatNumber(sum)" />
                </div>
                <div v-else class="text-grid">
                    <template v-for="resource in ResourceTypes" :key="resource">
                        <template v-if="notification.resources[resource] > 0">
                            <span v-text="translate(t => t.extension.resources[resource])" />
                            <span v-text="formatNumber(notification.resources[resource])" />
                        </template>
                    </template>

                    <span v-text="translate(t => t.extension.common.sum)" />
                    <span v-text="formatNumber(sum)" />
                </div>
            </template>
        </template>
    </Notification>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { DebrisFieldReportTrackingNotificationMessageData } from '@ogame-tracker/shared/messages/notifications';
    import { ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
    import Notification from '../Notification.vue';
    import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
    import { formatNumber, translate } from '../../i18n';
    import { useSettingsStore } from '../../stores/settings';

    const { notification } = defineProps<{ notification: DebrisFieldReportTrackingNotificationMessageData }>();
    const emit = defineEmits<{ remove: [] }>();
    const settingsStore = useSettingsStore();

    const showSimplified = computed(() => settingsStore.settings?.messageTracking.showSimplifiedResults ?? false);

    const title = computed(() => translate(t => t.extension.notifications.debrisFieldReportTracking.title(formatNumber(notification.count))));

    const message = computed(() => translate(t => t.extension.notifications.debrisFieldReportTracking.message(formatNumber(notification.count))));

    const sum = computed(() => notification.resources.metal + notification.resources.crystal);

    const hasResources = computed(() =>
        notification.resources.metal > 0
            || notification.resources.crystal > 0
            || notification.resources.deuterium > 0,
    );
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