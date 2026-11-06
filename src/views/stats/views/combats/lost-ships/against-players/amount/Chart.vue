<template>
    <div class="chart-container">
        <StatsChart
            :datasets="datasets"
            :firstDay="firstDay"
            :itemsPerDay="reportsPerDay"
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
                        <div v-text="translations().extension.combats.shipsLost" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="formatNumber(getSum(datasets))" />
                    <div v-text="`${translations().extension.combats.shipsLost} (${translations().extension.common.total})`" />
                </div>
            </template>
        </StatsChart>

        <FloatingMenu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <CombatTrackingIgnoreEspionageCombatsSettings />
            <hr />
            <ShipColorSettings />
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
import { useCombatReportStore } from '@stats/data/CombatReportDataModule';
import type { DailyCombatReportResult } from '@stats/data/CombatReportDataModule';
import { ShipTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ShipColorSettings from '@stats/components/settings/colors/ShipColorSettings.vue';
import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';

const settingsStore = useSettingsStore();

const combatReportStore = useCombatReportStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.ships);

const firstDay = computed(() => combatReportStore.firstDay);

const reportsPerDay = computed(() => combatReportStore.dailyResults);

const datasets = computed<StatsChartDataset<DailyCombatReportResult>[]>(() => {
    return ShipTypes.map(ship => ({
        key: ship.toString(),
        label: translations().ogame.ships[ship],
        color: colors.value[ship],
        filled: true,
        getValue: result => result.lostShips.againstPlayers.ships[ship],
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
