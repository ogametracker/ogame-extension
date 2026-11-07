<template>
    <div class="chart-container">
        <StatsChart :firstDay="firstDay" :itemsPerDay="missionsPerDay" :datasets="datasets" stacked show-average>
            <template #tooltip-footer="{ datasets }">
                <div class="footer-item">
                    <div class="number" v-text="formatNumber(getSum(getVisibleDatasets(datasets)))" />
                    <div v-text="translations().extension.empire.lifeforms.artifacts" />
                </div>
            </template>
        </StatsChart>

        <FloatingMenu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <LifeformDiscoveryColorSettings />
        </FloatingMenu>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import { computed, ref } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import StatsChart from '@stats/components/stats/StatsChart.vue';
import type { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
import type { ScollableChartFooterDataset } from '@stats/components/common/scrollable-chart/ScrollableChart.vue';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import { useLifeformDiscoveryStore } from '@stats/data/LifeformDiscoveryDataModule';
import type { DailyLifeformDiscoveryResult } from '@stats/data/LifeformDiscoveryDataModule';
import LifeformDiscoveryColorSettings from '@stats/components/settings/colors/LifeformDiscoveryColorSettings.vue';

const settingsStore = useSettingsStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const showSettings = ref(false);

const color = computed(() => settingsStore.settings.colors.lifeformDiscoveries.events.artifacts);

const firstDay = computed(() => lifeformDiscoveryStore.firstDay);

const missionsPerDay = computed(() => lifeformDiscoveryStore.dailyResults);

const datasets = computed<StatsChartDataset<DailyLifeformDiscoveryResult>[]>(() => {
    return [
        {
            key: 'artifacts',
            label: translations().extension.empire.lifeforms.artifacts,
            color: color.value,
            filled: true,
            getValue: (result: DailyLifeformDiscoveryResult) => result.artifacts,
            showAverage: true,
        },
    ];
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
