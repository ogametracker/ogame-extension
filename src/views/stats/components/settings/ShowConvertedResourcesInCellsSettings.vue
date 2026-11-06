<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="translations().extension.settings.showConvertedUnitsInTables.title" />
        </div>
        <div class="fake-table-body">
            <Checkbox
                :model-value="showCellsWithConvertedResourceUnits"
                @update:model-value="toggle($event)"
                :label="translations().extension.settings.showConvertedUnitsInTables.label"
            />
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from '@stats/components/common/Checkbox.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import { useSettingsStore } from '../../data/SettingsDataModule';

const settingsStore = useSettingsStore();

const showCellsWithConvertedResourceUnits = computed(() => settingsStore.settings.showCellsWithConvertedResourceUnits);

function toggle(nextShowCellsWithConvertedResourceUnits: boolean) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        showCellsWithConvertedResourceUnits: nextShowCellsWithConvertedResourceUnits,
    });
}
</script>

<style lang="scss" scoped>
.fake-table {
    max-width: 400px;
    border: 1px solid rgba(var(--color), 0.5);
    border-radius: 4px;
    display: grid;
    width: fit-content;

    &-header {
        height: 100%;
        background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        justify-content: center;
        align-items: center;
        padding: 8px;
        display: flex;
    }

    &-body {
        height: 100%;
        padding: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
</style>
