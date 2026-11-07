<template>
    <div class="fake-table">
        <div class="fake-table-header">
            <span v-text="translations().extension.settings.debrisFields.separateExpeditionDebrisFields.title" />
        </div>
        <div class="fake-table-body">
            <Checkbox
                :model-value="separateExpeditionDebrisFields"
                @update:model-value="toggle($event)"
                :label="translations().extension.settings.debrisFields.separateExpeditionDebrisFields.label"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from '@stats/components/common/Checkbox.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import { useSettingsStore } from '@stats/data/SettingsDataModule';

const settingsStore = useSettingsStore();

const separateExpeditionDebrisFields = computed(
    () => settingsStore.settings.debrisFields.separateExpeditionDebrisFields,
);

function toggle(nextSeparateExpeditionDebrisFields: boolean) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        debrisFields: {
            ...settingsStore.settings.debrisFields,
            separateExpeditionDebrisFields: nextSeparateExpeditionDebrisFields,
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
