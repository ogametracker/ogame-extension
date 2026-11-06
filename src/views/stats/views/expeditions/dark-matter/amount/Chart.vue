<template>
    <div class="chart-container">
        <stats-chart
            :firstDay="firstDay"
            :itemsPerDay="exposPerDay"
            :datasets="datasets"
            stacked
            show-average
            no-legend
            no-tooltip-footer
        />

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <expedition-event-color-settings />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import StatsChart from '@stats/components/stats/StatsChart.vue';
import type { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ExpeditionEventColorSettings from '@stats/components/settings/colors/ExpeditionEventColorSettings.vue';

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const color = computed(() => settingsStore.settings.colors.expeditions.events.darkMatter);

const datasets = computed<StatsChartDataset<DailyExpeditionResult>[]>(() => {
    return [{
        key: 'dark-matter',
        label: translations().ogame.premium.darkMatter,
        color: color.value,
        filled: true,
        getValue: (result: DailyExpeditionResult) => result.findings.darkMatter,
        showAverage: true,
    }];
});

const firstDay = computed(() => expeditionStore.firstDay);

const exposPerDay = computed(() => expeditionStore.dailyResults);
</script>

<style lang="scss" scoped>
    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>
