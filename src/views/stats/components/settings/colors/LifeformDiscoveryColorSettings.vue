<template>
    <color-settings-table
        :header="translations().extension.settings.colors.lifeformDiscoveries"
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
import { LifeformDiscoveryEventType } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ColorSettingsTable from './ColorSettingsTable.vue';

const settingsStore = useSettingsStore();

const labels = computed<Record<LifeformDiscoveryEventType, string>>(() => {
    return {
        [LifeformDiscoveryEventType.nothing]: translations().extension.empire.lifeforms.eventTypes.nothing,
        [LifeformDiscoveryEventType.lostShip]: translations().extension.empire.lifeforms.eventTypes.lostShip,
        [LifeformDiscoveryEventType.newLifeformFound]: translations().extension.empire.lifeforms.lifeformFound,
        [LifeformDiscoveryEventType.knownLifeformFound]: translations().extension.empire.lifeforms.lifeformFound,
        [LifeformDiscoveryEventType.artifacts]: translations().extension.empire.lifeforms.eventTypes.artifacts,
    };
});

const keys: LifeformDiscoveryEventType[] = [
    LifeformDiscoveryEventType.nothing,
    LifeformDiscoveryEventType.lostShip,
    LifeformDiscoveryEventType.knownLifeformFound,
];

const colors = computed(() => settingsStore.settings.colors.lifeformDiscoveries.events);

function updateColors(value: Record<LifeformDiscoveryEventType, string>) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        colors: {
            ...settingsStore.settings.colors,
            lifeformDiscoveries: {
                ...settingsStore.settings.colors.lifeformDiscoveries,
                events: value,
            },
        },
    });
}

function resetColors() {
    const defaultColors = getDefaultSettings(LanguageKey.de).colors.lifeformDiscoveries.events;
    updateColors(defaultColors);
}
</script>
