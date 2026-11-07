<template>
    <ColorSettingsTable
        :header="translations().extension.settings.colors.combatResults"
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
import { CombatResultType } from '@ogame-tracker/shared/models/combat-reports/CombatResultType';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ColorSettingsTable from './ColorSettingsTable.vue';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';

const settingsStore = useSettingsStore();

const labels = computed<Record<CombatResultType, string>>(() => translations().extension.combats.combatResults);

const keys: CombatResultType[] = [CombatResultType.won, CombatResultType.lost, CombatResultType.draw];

const colors = computed(() => settingsStore.settings.colors.combatResults);

function updateColors(value: Record<CombatResultType, string>) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        colors: {
            ...settingsStore.settings.colors,
            combatResults: value,
        },
    });
}

function resetColors() {
    const defaultColors = getDefaultSettings(LanguageKey.de).colors.combatResults;
    updateColors(defaultColors);
}
</script>
