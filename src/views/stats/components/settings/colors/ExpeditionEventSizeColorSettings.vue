<template>
    <ColorSettingsTable
        :header="translations().extension.settings.colors.expeditionEventSizes"
        :labels="labels"
        :keys="keys"
        :model-value="colors"
        @update:model-value="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
import type { ExpeditionEventCombatSize } from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import { ExpeditionEventSize } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ColorSettingsTable from './ColorSettingsTable.vue';

const settingsStore = useSettingsStore();

const labels = computed(() => translations().extension.expeditions.expeditionEventSizes);

const keys: (ExpeditionEventSize | ExpeditionEventCombatSize)[] = [
    ExpeditionEventSize.small,
    ExpeditionEventSize.medium,
    ExpeditionEventSize.large,
    'fled-death-star',
];

const colors = computed(() => settingsStore.settings.colors.expeditions.sizes);

function updateColors(value: Record<ExpeditionEventSize | ExpeditionEventCombatSize, string>) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        colors: {
            ...settingsStore.settings.colors,
            expeditions: {
                ...settingsStore.settings.colors.expeditions,
                sizes: value,
            },
        },
    });
}

function resetColors() {
    const defaultColors = getDefaultSettings(LanguageKey.de).colors.expeditions.sizes;
    updateColors(defaultColors);
}
</script>
