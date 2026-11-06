<template>
    <div class="chart-container">
        <stats-chart
            :firstDay="firstDay"
            :itemsPerDay="exposPerDay"
            :datasets="datasets"
            stacked
            show-average
        >
            <template #tooltip-footer="{ datasets }">
                <template
                    v-if="getVisibleDatasets(datasets).length < datasets.length"
                >
                    <div class="footer-item">
                        <div
                            class="number"
                            v-text="
                                formatNumber(getSum(getVisibleDatasets(datasets)))
                            "
                        />
                    <div v-text="translations().extension.expeditions.shipsFound" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="formatNumber(getSum(datasets))" />
                    <div v-text="`${translations().extension.expeditions.shipsFound} (${translations().extension.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <ship-color-settings />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import { ExpeditionFindableShipTypes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import StatsChart from '@stats/components/stats/StatsChart.vue';
import type { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
import type { ScollableChartFooterDataset } from '@stats/components/common/scrollable-chart/ScrollableChart.vue';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ShipColorSettings from '@stats/components/settings/colors/ShipColorSettings.vue';

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.ships);

const firstDay = computed(() => expeditionStore.firstDay);

const exposPerDay = computed(() => expeditionStore.dailyResults);

const datasets = computed<StatsChartDataset<DailyExpeditionResult>[]>(() => {
    return ExpeditionFindableShipTypes.map(ship => ({
        key: `${ship}`,
        label: translations().ogame.ships[ship],
        color: colors.value[ship],
        filled: true,
        getValue: result => result.findings.fleet[ship],
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
