<template>
    <notification type="info" :title="title" @remove="emit('remove')" :timeout="10000">
        <template #message>
            <div v-if="notification.count > 0" v-text="message" />

            <template v-if="hasLoot">
                <hr />
                <div class="resources-grid" v-if="showSimplified">
                    <o-resource :resource="ResourceType.metal" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.metal < 0,
                            fade: notification.resources.metal == 0,
                        }"
                        v-text="formatNumber(notification.resources.metal)"
                    />

                    <o-resource :resource="ResourceType.crystal" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.crystal < 0,
                            fade: notification.resources.crystal == 0,
                        }"
                        v-text="formatNumber(notification.resources.crystal)"
                    />

                    <o-resource :resource="ResourceType.deuterium" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.deuterium < 0,
                            fade: notification.resources.deuterium == 0,
                        }"
                        v-text="formatNumber(notification.resources.deuterium)"
                    />

                    <span class="mdi mdi-sigma" />
                    <span
                        :class="{
                            'negative-loot': sum < 0,
                            fade: sum == 0,
                        }"
                        v-text="formatNumber(sum)"
                    />
                </div>
                <div class="text-grid" v-else>
                    <span v-text="translate(t => t.extension.resources[ResourceType.metal])" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.metal < 0,
                            fade: notification.resources.metal == 0,
                        }"
                        v-text="formatNumber(notification.resources.metal)"
                    />

                    <span v-text="translate(t => t.extension.resources[ResourceType.crystal])" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.crystal < 0,
                            fade: notification.resources.crystal == 0,
                        }"
                        v-text="formatNumber(notification.resources.crystal)"
                    />

                    <span v-text="translate(t => t.extension.resources[ResourceType.deuterium])" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.deuterium < 0,
                            fade: notification.resources.deuterium == 0,
                        }"
                        v-text="formatNumber(notification.resources.deuterium)"
                    />

                    <span v-text="translate(t => t.extension.common.sum)" />
                    <span
                        :class="{
                            'negative-loot': sum < 0,
                            fade: sum == 0,
                        }"
                        v-text="formatNumber(sum)"
                    />
                </div>
            </template>
        </template>
    </notification>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { CombatTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import Notification from '../Notification.vue';
    import OResource from '@/views/_shared/components/ogame/OResource.vue';
    import { formatNumber, translate } from '../../i18n';
    import { useSettingsStore } from '../../stores/settings';

    const { notification } = defineProps<{ notification: CombatTrackingNotificationMessageData }>();
    const emit = defineEmits<{ remove: [] }>();
    const settingsStore = useSettingsStore();

    const showSimplified = computed(() => settingsStore.settings?.messageTracking.showSimplifiedResults ?? false);

    const title = computed(() => translate(t => t.extension.notifications.combatTracking.title(formatNumber(notification.count))));

    const message = computed(() => translate(t => t.extension.notifications.combatTracking.message(formatNumber(notification.count))));

    const hasLoot = computed(() => Object.values(notification.resources).reduce((acc, cur) => acc + cur, 0) > 0);

    const sum = computed(() =>
        notification.resources.metal
            + notification.resources.crystal
            + notification.resources.deuterium,
    );
</script>
<style lang="scss" scoped>
    .negative-loot {
        color: red;
    }

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
        grid-template-columns: auto 1fr;
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;
    }
</style>