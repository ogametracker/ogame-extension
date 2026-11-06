<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="expos" :items="items" :footerItems="footerItems" show-percentage>
            <template #cell-label="{ value }">
                <span v-text="value" />

                <span v-if="value == translations().extension.expeditions.expeditionEventSizes.small" class="mdi mdi-hexagon-slice-1" :style="{ color: colors.small }" />
                <span v-else-if="value == translations().extension.expeditions.expeditionEventSizes.medium" class="mdi mdi-hexagon-slice-3" :style="{ color: colors.medium }" />
                <span v-else-if="value == translations().extension.expeditions.expeditionEventSizes.large" class="mdi mdi-hexagon-slice-5" :style="{ color: colors.large }" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { PropType } from 'vue';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import { ExpeditionEventSizes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';

const props = defineProps({
    resource: { required: true, type: String as PropType<ResourceType>, validator: (value: ResourceType) => ResourceTypes.includes(value) },
});

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.expeditions.sizes);

const expos = computed(() => expeditionStore.dailyResultsArray);

const items = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return ExpeditionEventSizes.map(size => ({
        label: translations().extension.expeditions.expeditionEventSizes[size],
        getValue: nextExpos => nextExpos.reduce((acc, expo) => acc + expo.eventSizes.resourceCount[props.resource][size], 0),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return [{
        label: translations().extension.common.sum,
        getValue: nextExpos => nextExpos.reduce((acc, expo) => acc + expo.findings.resourceCount[props.resource], 0),
    }];
});
</script>

<style lang="scss" scoped>
    .ranged-stats-table .mdi {
        transform: translateX(-30%) scale(1.6);
        width: 24px;
        display: inline-block;
    }

    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>
