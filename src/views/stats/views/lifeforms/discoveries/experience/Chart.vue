<template>
    <div class="chart-container">
        <stats-chart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="exposPerDay">
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="formatNumber(getTotal(getVisibleDatasets(datasets)))" />
                        <div v-text="translations().extension.empire.lifeforms.experiencePoints" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="formatNumber(getTotal(datasets))" />
                    <div v-text="`${translations().extension.empire.lifeforms.experiencePoints} (${translations().extension.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <lifeform-color-settings />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import StatsChart from '@stats/components/stats/StatsChart.vue';
import type { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
import type { ScollableChartFooterDataset } from '@stats/components/common/scrollable-chart/ScrollableChart.vue';
import { useLifeformDiscoveryStore } from '@stats/data/LifeformDiscoveryDataModule';
import type { DailyLifeformDiscoveryResult } from '@stats/data/LifeformDiscoveryDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import LifeformColorSettings from '@stats/components/settings/colors/LifeformColorSettings.vue';
import { ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';

const settingsStore = useSettingsStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.lifeforms);

const firstDay = computed(() => lifeformDiscoveryStore.firstDay);

const exposPerDay = computed(() => lifeformDiscoveryStore.dailyResults);

const datasets = computed<StatsChartDataset<DailyLifeformDiscoveryResult>[]>(() => {
    return ValidLifeformTypes.map(lifeform => ({
        key: lifeform,
        label: translations().ogame.lifeforms[lifeform],
        color: colors.value[lifeform],
        filled: true,
        getValue: (result: DailyLifeformDiscoveryResult) => result.lifeformExperience[lifeform],
        showAverage: true,
    }));
});

function getVisibleDatasets(nextDatasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
    return nextDatasets.filter(d => d.visible);
}

function getTotal(nextDatasets: ScollableChartFooterDataset[]): number {
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
