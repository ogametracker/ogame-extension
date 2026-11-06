<template>
    <div class="chart-container">
        <StatsChart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="exposPerDay">
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="formatNumber(getSum(getVisibleDatasets(datasets)))" />
                        <div v-text="translations().extension.expeditions.expeditions" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="formatNumber(getSum(datasets))" />
                    <div v-text="`${translations().extension.expeditions.expeditions} (${translations().extension.common.total})`" />
                </div>
            </template>
        </StatsChart>

        <FloatingMenu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <ExpeditionDepletionColorSettings />
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
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ExpeditionDepletionColorSettings from '@stats/components/settings/colors/ExpeditionDepletionColorSettings.vue';
import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@ogame-tracker/shared/models/expeditions/ExpeditionDepletionLevel';

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.expeditions.depletion);

const firstDay = computed(() => expeditionStore.firstDay);

const exposPerDay = computed(() => expeditionStore.dailyResults);

function getVisibleDatasets(nextDatasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
    return nextDatasets.filter(d => d.visible);
}

const datasets = computed<StatsChartDataset<DailyExpeditionResult>[]>(() => {
    const levels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

    return levels.map<StatsChartDataset<DailyExpeditionResult>>(level => ({
        key: level,
        label: translations().extension.expeditions.depletionLevels[level],
        color: colors.value[level],
        filled: true,
        getValue: result => result.depletion[level],
        showAverage: true,
    }));
});

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
