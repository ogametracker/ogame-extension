<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="translations().extension.settings.accessibility.showSimplifiedResults.title" />
        </div>
        <div class="fake-table-body">
            <Checkbox
                :model-value="showSimplifiedResults"
                @update:model-value="toggleShowSimplifiedResults($event)"
                :label="translations().extension.settings.accessibility.showSimplifiedResults.label"
            />
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from '@stats/components/common/Checkbox.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import { useSettingsStore } from '@stats/data/SettingsDataModule';

const settingsStore = useSettingsStore();

const showSimplifiedResults = computed(() => settingsStore.settings.messageTracking.showSimplifiedResults);

function toggleShowSimplifiedResults(nextShowSimplifiedResults: boolean) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        messageTracking: {
            ...settingsStore.settings.messageTracking,
            showSimplifiedResults: nextShowSimplifiedResults,
        }
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
