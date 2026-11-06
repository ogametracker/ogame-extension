<template>
    <div class="chart-container">
        <stats-chart :firstDay="firstDay" :itemsPerDay="exposPerDay" :datasets="datasets" stacked show-average>
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="formatNumber(getSum(getVisibleDatasets(datasets)))" />
                        <div v-text="translations().extension.expeditions.finds" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="formatNumber(getSum(datasets))" />
                    <div v-text="`${translations().extension.expeditions.finds} (${translations().extension.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <expedition-event-size-color-settings />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import type { PropType } from 'vue';
import StatsChart from '@stats/components/stats/StatsChart.vue';
import type { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
import { ExpeditionEventSizes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import type { ScollableChartFooterDataset } from '@stats/components/common/scrollable-chart/ScrollableChart.vue';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ExpeditionEventSizeColorSettings from '@stats/components/settings/colors/ExpeditionEventSizeColorSettings.vue';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';

const props = defineProps({
    resource: { required: true, type: String as PropType<ResourceType>, validator: (value: ResourceType) => ResourceTypes.includes(value) },
});

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.expeditions.sizes);

const firstDay = computed(() => expeditionStore.firstDay);

const exposPerDay = computed(() => expeditionStore.dailyResults);

const datasets = computed<StatsChartDataset<DailyExpeditionResult>[]>(() => {
    return ExpeditionEventSizes.map(size => ({
        key: size,
        label: translations().extension.expeditions.expeditionEventSizes[size],
        color: colors.value[size],
        filled: true,
        getValue: item => item.eventSizes.resourceCount[props.resource][size],
        showAverage: true,
    }));
});

function getVisibleDatasets(nextDatasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
    return nextDatasets.filter(d => d.visible);
}

function getSum(nextDatasets: ScollableChartFooterDataset[]): number {
    return nextDatasets.reduce((acc, cur) => acc + cur.value, 0);
}
</script>

<style lang="scss" scoped>
    .footer-item {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 4px;

        .number {
            text-align: right;
        }
    }

    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>
