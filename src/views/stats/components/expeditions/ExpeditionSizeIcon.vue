<template>
    <span v-if="size == ExpeditionEventSize.small" class="mdi mdi-hexagon-slice-1" :style="{ color: colors.small }" />
    <span
        v-else-if="size == ExpeditionEventSize.medium"
        class="mdi mdi-hexagon-slice-3"
        :style="{ color: colors.medium }"
    />
    <span
        v-else-if="size == ExpeditionEventSize.large"
        class="mdi mdi-hexagon-slice-5"
        :style="{ color: colors.large }"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ExpeditionEventSize } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import type { PropType } from 'vue';
import { useSettingsStore } from '../../data/SettingsDataModule';

defineProps({
    size: { required: true, type: String as PropType<ExpeditionEventSize> },
});

const settingsStore = useSettingsStore();

const colors = computed(() => settingsStore.settings.colors.expeditions.sizes);
</script>
