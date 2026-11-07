<template>
    <div class="chart-container">
        <StatsChart :firstDay="firstDay" :itemsPerDay="missionsPerDay" :datasets="datasets" stacked show-average>
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
                    <div
                        v-text="
                            `${translations().extension.expeditions.finds} (${translations().extension.common.total})`
                        "
                    />
                </div>
            </template>
        </StatsChart>

        <FloatingMenu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            Coming soon
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
import { LifeformDiscoveryEventArtifactFindingSizes } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';

const settingsStore = useSettingsStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.lifeformDiscoveries.artifactFindingSizes);

const firstDay = computed(() => lifeformDiscoveryStore.firstDay);

const missionsPerDay = computed(() => lifeformDiscoveryStore.dailyResults);

const datasets = computed<StatsChartDataset<DailyLifeformDiscoveryResult>[]>(() => {
    return LifeformDiscoveryEventArtifactFindingSizes.map(size => ({
        key: size,
        label: translations().extension.empire.lifeforms.artifactFindingSizes[size],
        color: colors.value[size],
        filled: true,
        getValue: result => result.artifactSizes[size],
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
