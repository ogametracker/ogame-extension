<template>
    <stats-chart
        :datasets="datasets"
        :filter="(combat) => filterCombat(combat)"
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
                        v-text="$number(getSum(getVisibleDatasets(datasets)))"
                    />
                    <div>LOCA: Ships lost</div>
                </div>
                <hr />
            </template>

            <div class="footer-item">
                <div class="number" v-text="$number(getSum(datasets))" />
                <div>LOCA: Ships lost</div>
            </div>
        </template>
    </stats-chart>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/v1/combat-reports/CombatReport';
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {
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
            return CombatReportDataModule.reportsPerDay;
        }

        private get datasets(): StatsChartDataset<CombatReport>[] {
            return getNumericEnumValues<ShipType>(ShipType).map(ship => ({
                key: ship.toString(),
                label: `LOCA: ${ship}`, //LOCA
                color: this.colors[ship],
                filled: true,
                getValue: reports => reports.reduce((acc, report) => acc + report.lostShips[ship], 0),
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
</style>