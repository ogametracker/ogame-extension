<template>
    <div class="chart-container">
        <stats-chart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="exposPerDay">
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

            <conversion-rate-settings />
            <hr />
            <resource-color-settings />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import StatsChart from '@stats/components/stats/StatsChart.vue';
import type { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import type { ScollableChartFooterDataset } from '@stats/components/common/scrollable-chart/ScrollableChart.vue';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
import ConversionRateSettings from '@stats/components/settings/ConversionRateSettings.vue';

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.resources);

const firstDay = computed(() => expeditionStore.firstDay);

const exposPerDay = computed(() => expeditionStore.dailyResults);

const conversionModeText = computed(() => {
    return settingsStore.settings.conversionRates.mode == 'msu'
        ? translations().extension.common.msu
        : translations().extension.common.dsu;
});

const datasets = computed<StatsChartDataset<DailyExpeditionResult>[]>(() => {
    return ResourceTypes.map(resource => ({
        key: resource,
        label: translations().extension.resources[resource],
        color: colors.value[resource],
        filled: true,
        getValue: (result: DailyExpeditionResult) => result.findings.resourceCount[resource],
        showAverage: true,
    }));
});

function getVisibleDatasets(nextDatasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
    return nextDatasets.filter(d => d.visible);
}

function getSum(nextDatasets: ScollableChartFooterDataset[]): number {
    const resources: string[] = [ResourceType.metal, ResourceType.crystal, ResourceType.deuterium];
    return nextDatasets
        .filter(d => resources.includes(d.key.toString()))
        .reduce((acc, cur) => acc + cur.value, 0);
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
