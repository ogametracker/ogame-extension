<template>
    <ColorSettingsTable
        :header="translations().extension.settings.colors.expeditionDepletionLevels"
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
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@ogame-tracker/shared/models/expeditions/ExpeditionDepletionLevel';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ColorSettingsTable from './ColorSettingsTable.vue';

const settingsStore = useSettingsStore();

const depletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

const labels = computed<Record<ExpeditionDepletionLevel | 'unknown', string>>(() => createRecord(depletionLevels, level => translations().extension.expeditions.depletionLevels[level]));

const keys = depletionLevels;

const colors = computed(() => settingsStore.settings.colors.expeditions.depletion);

function updateColors(value: Record<ExpeditionDepletionLevel | 'unknown', string>) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        colors: {
            ...settingsStore.settings.colors,
            expeditions: {
                ...settingsStore.settings.colors.expeditions,
                depletion: value,
            },
        },
    });
}

function resetColors() {
    const defaultColors = getDefaultSettings(LanguageKey.de).colors.expeditions.depletion;
    updateColors(defaultColors);
}
</script>
