<template>
    <div class="chart-container">
        <stats-chart
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
                                $i18n.$n(getSum(getVisibleDatasets(datasets)))
                            "
                        />
                        <div v-text="$i18n.$t.combats.shipsLost" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$i18n.$n(getSum(datasets))" />
                    <div v-text="`${$i18n.$t.combats.shipsLost} (${$i18n.$t.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <combat-tracking-ignore-espionage-combats-settings />
            <hr />
            <ship-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
    import { ShipTypes } from '@/shared/models/ogame/ships/ShipType';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import ShipColorSettings from '@stats/components/settings/colors/ShipColorSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';

    @Component({
        components: {
            StatsChart,
            ShipColorSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.ships;
        }

        private filterCombat(combat: CombatReport): boolean {
            return combat.isExpedition;
        }

        private get firstDay() {
            return CombatReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return CombatReportDataModule.dailyResults;
        }

        private get datasets(): StatsChartDataset<DailyCombatReportResult>[] {
            return ShipTypes.map(ship => ({
                key: ship.toString(),
                label: this.$i18n.$t.ships[ship],
                color: this.colors[ship],
                filled: true,
                getValue: result => result.lostShips.onExpeditions.ships[ship],
            }));
        }

        private getVisibleDatasets(datasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
            return datasets.filter(d => d.visible);
        }

        private getSum(datasets: ScollableChartFooterDataset[]): number {
            return datasets.reduce((acc, cur) => acc + cur.value, 0);
        }
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