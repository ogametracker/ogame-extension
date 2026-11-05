<template>
    <notification type="info" :title="title" :timeout="10000" @remove="emit('remove')">
        <template #message>
            <div v-text="message" />

            <template v-if="notification.newLifeforms.length > 0">
                <hr />
                <div class="result-grid">
                    <template v-for="lifeform in notification.newLifeforms" :key="lifeform">
                        <o-lifeform :lifeform="lifeform" class="icon" />
                        <span v-text="translate(t => t.ogame.lifeforms[lifeform])" />
                    </template>
                </div>
            </template>

            <template v-if="foundExperience">
                <hr />
                <div class="result-grid xp-grid">
                    <template v-for="lifeform in ValidLifeformTypes" :key="lifeform">
                        <template v-if="notification.lifeformExperience[lifeform] > 0">
                            <o-lifeform :lifeform="lifeform" class="icon" />
                            <div class="xp-column">
                                <span v-text="translate(t => t.ogame.lifeforms[lifeform])" />
                                <span v-text="`+${formatNumber(notification.lifeformExperience[lifeform])} XP`" />
                            </div>
                        </template>
                    </template>
                </div>
            </template>

            <template v-if="foundArtifacts">
                <hr />
                <div class="result-grid artifact-grid">
                    <span class="mdi mdi-pyramid" :style="{ color: colors?.artifacts }" />
                    <span v-text="formatNumber(notification.artifacts)" />
                </div>
            </template>

            <hr />
            <div class="result-grid" v-if="showSimplified">
                <template v-if="notification.events.lostShip > 0">
                    <span class="mdi mdi-skull-crossbones-outline" :style="{ color: colors?.lostShip }" />
                    <span v-text="formatNumber(notification.events.lostShip)" />
                </template>
                <template v-if="lifeformFindingCount > 0">
                    <span class="mdi mdi-star-shooting" :style="{ color: colors?.knownLifeformFound }" />
                    <span v-text="formatNumber(lifeformFindingCount)" />
                </template>
                <template v-if="notification.events.artifacts > 0">
                    <span class="mdi mdi-pyramid" :style="{ color: colors?.artifacts }" />
                    <span v-text="formatNumber(notification.events.artifacts)" />
                </template>
                <template v-if="notification.events.nothing > 0">
                    <span class="mdi mdi-close" :style="{ color: colors?.nothing }" />
                    <span v-text="formatNumber(notification.events.nothing)" />
                </template>
            </div>
            <div v-else class="text-grid">
                <template v-if="notification.events.lostShip > 0">
                    <span v-text="translate(t => t.extension.empire.lifeforms.eventTypes.lostShip)" />
                    <span v-text="formatNumber(notification.events.lostShip)" />
                </template>
                <template v-if="lifeformFindingCount > 0">
                    <span v-text="translate(t => t.extension.empire.lifeforms.lifeformFound)" />
                    <span v-text="formatNumber(lifeformFindingCount)" />
                </template>
                <template v-if="notification.events.artifacts > 0">
                    <span v-text="translate(t => t.extension.empire.lifeforms.artifacts)" />
                    <span v-text="formatNumber(notification.events.artifacts)" />
                </template>
                <template v-if="notification.events.nothing > 0">
                    <span v-text="translate(t => t.extension.empire.lifeforms.eventTypes.nothing)" />
                    <span v-text="formatNumber(notification.events.nothing)" />
                </template>
            </div>
        </template>
    </notification>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import Notification from '../Notification.vue';
    import type { LifeformDiscoveryTrackingNotificationMessageData } from '@ogame-tracker/shared/messages/notifications';
    import { ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
    import OLifeform from '@ogame-tracker/view-shared/components/ogame/OLifeform.vue';
    import { formatNumber, translate } from '../../i18n';
    import { useSettingsStore } from '../../stores/settings';

    const { notification } = defineProps<{ notification: LifeformDiscoveryTrackingNotificationMessageData }>();
    const emit = defineEmits<{ remove: [] }>();
    const settingsStore = useSettingsStore();

    const showSimplified = computed(() => settingsStore.settings?.messageTracking.showSimplifiedResults ?? false);

    const colors = computed(() => settingsStore.settings?.colors.lifeformDiscoveries.events);

    const count = computed(() =>
        Object.values(notification.events)
            .reduce((acc, cur) => acc + cur, 0),
    );

    const lifeformFindingCount = computed(() => notification.events.newLifeformFound + notification.events.knownLifeformFound);

    const foundExperience = computed(() => Object.values(notification.lifeformExperience).some(xp => xp > 0));

    const foundArtifacts = computed(() => notification.artifacts > 0);

    const title = computed(() => translate(t => t.extension.notifications.lifeformDiscoveryTracking.title(formatNumber(count.value))));

    const message = computed(() => translate(t => t.extension.notifications.lifeformDiscoveryTracking.message(formatNumber(count.value))));
</script>
<style lang="scss" scoped>
    .result-grid {
        &.xp-grid {
            grid-template-columns: repeat(2, 32px 1fr);
        }

        display: grid;
        grid-template-columns: repeat(3, 32px 1fr);
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;

        + .result-grid,
        + .result-flex {
            margin-top: 8px;
        }

        .mdi {
            transform: scale(1.5);
            width: 24px;
            text-align: center;
            height: 20px;
        }

        .icon {
            justify-self: center;
        }
    }

    .result-flex {
        display: flex;
        flex-direction: row;
        column-gap: 8px;
        row-gap: 4px;

        + .result-grid {
            margin-top: 8px;
        }
    }

    .text-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;

        &.events {
            grid-template-columns: repeat(2, auto 1fr);
        }
    }

    .text-grid,
    .result-flex {
        + .text-grid {
            margin-top: 4px;
            padding-top: 4px;
            border-top: 1px solid rgba(var(--color));
        }
    }

    .xp-column {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
    }
</style>