<template>
    <color-settings-table
        :header="translations().extension.settings.colors.expeditionEvents"
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
import { ExpeditionEventType } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ColorSettingsTable from './ColorSettingsTable.vue';

const settingsStore = useSettingsStore();

const labels = computed<Record<ExpeditionEventType, string>>(() => translations().extension.expeditions.expeditionEvents);

const keys: ExpeditionEventType[] = [
    ExpeditionEventType.nothing,
    ExpeditionEventType.resources,
    ExpeditionEventType.fleet,
    ExpeditionEventType.delay,
    ExpeditionEventType.early,
    ExpeditionEventType.darkMatter,
    // legacy: ExpeditionEventType.pirates,
    // legacy: ExpeditionEventType.aliens,
    ExpeditionEventType.combat,
    ExpeditionEventType.item,
    ExpeditionEventType.trader,
    ExpeditionEventType.lostFleet,
];

const colors = computed(() => settingsStore.settings.colors.expeditions.events);

function updateColors(value: Record<ExpeditionEventType, string>) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        colors: {
            ...settingsStore.settings.colors,
            expeditions: {
                ...settingsStore.settings.colors.expeditions,
                events: value,
            },
        },
    });
}

function resetColors() {
    const defaultColors = getDefaultSettings(LanguageKey.de).colors.expeditions.events;
    updateColors(defaultColors);
}
</script>
