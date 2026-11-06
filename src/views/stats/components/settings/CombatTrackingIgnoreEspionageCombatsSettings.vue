<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="translations().extension.settings.combats.ignoreEspionageCombats.title" />
        </div>
        <div class="fake-table-body">
            <checkbox
                :model-value="ignoreEspionageCombats"
                @update:model-value="setIgnoreEspionageCombats($event)"
                :label="translations().extension.settings.combats.ignoreEspionageCombats.label"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import { useSettingsStore } from '../../data/SettingsDataModule';

const settingsStore = useSettingsStore();

const ignoreEspionageCombats = computed(() => settingsStore.settings.combatTracking.ignoreEspionageFights);

function setIgnoreEspionageCombats(ignoreEspionageFights: boolean) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        combatTracking: {
            ignoreEspionageFights,
        },
    });
}
</script>

<style lang="scss" scoped>
    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;
        max-width: 400px;

        &-header {
            background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
            justify-content: center;
        }

        &-header,
        &-body {
            height: 100%;
            padding: 8px;
            display: flex;
            align-items: center;
        }
    }
</style>
