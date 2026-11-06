<template>
    <color-settings-table
        :header="translations().extension.settings.colors.resources"
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
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ColorSettingsTable from './ColorSettingsTable.vue';

const settingsStore = useSettingsStore();

const labels = computed<Record<ResourceType | 'totalConverted', string>>(() => {
    return {
        [ResourceType.metal]: translations().extension.resources.metal,
        [ResourceType.crystal]: translations().extension.resources.crystal,
        [ResourceType.deuterium]: translations().extension.resources.deuterium,
        totalConverted: `${translations().extension.common.resourceUnits} (${translations().extension.common.msu}/${translations().extension.common.dsu})`,
    };
});

const keys: (ResourceType | 'totalConverted')[] = [
    ResourceType.metal,
    ResourceType.crystal,
    ResourceType.deuterium,
    'totalConverted',
];

const colors = computed(() => settingsStore.settings.colors.resources);

function updateColors(value: Record<ResourceType | 'totalConverted', string>) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        colors: {
            ...settingsStore.settings.colors,
            resources: value,
        },
    });
}

function resetColors() {
    const defaultColors = getDefaultSettings(LanguageKey.de).colors.resources;
    updateColors(defaultColors);
}
</script>
