<template>
    <div class="chart-container">
        <stats-chart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="exposPerDay">
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="formatNumber(getTotal(getVisibleDatasets(datasets)))" />
                        <div v-text="translations().extension.empire.lifeforms.discoveryMissions" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="formatNumber(getTotal(datasets))" />
                    <div v-text="`${translations().extension.empire.lifeforms.discoveryMissions} (${translations().extension.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <lifeform-discovery-color-settings />
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
import LifeformDiscoveryColorSettings from '@stats/components/settings/colors/LifeformDiscoveryColorSettings.vue';
import { LifeformDiscoveryEventType } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';

const settingsStore = useSettingsStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.lifeformDiscoveries.events);

const firstDay = computed(() => lifeformDiscoveryStore.firstDay);

const exposPerDay = computed(() => lifeformDiscoveryStore.dailyResults);

const datasets = computed<StatsChartDataset<DailyLifeformDiscoveryResult>[]>(() => {
    const typeGroups: LifeformDiscoveryEventType[][] = [
        [LifeformDiscoveryEventType.nothing],
        [LifeformDiscoveryEventType.lostShip],
        [LifeformDiscoveryEventType.newLifeformFound, LifeformDiscoveryEventType.knownLifeformFound],
        [LifeformDiscoveryEventType.artifacts],
    ]
    return typeGroups.map(group => ({
        key: group[0],
        label: group.length == 1
            ? translations().extension.empire.lifeforms.eventTypes[group[0]]
            : translations().extension.empire.lifeforms.lifeformFound,
        color: group.length == 1 ? colors.value[group[0]] : colors.value.knownLifeformFound,
        filled: true,
        getValue: (result: DailyLifeformDiscoveryResult) => group.reduce((acc, cur) => acc + result.events[cur], 0),
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
