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

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ShipType, string> = {
            [ShipType.lightFighter]: '#2472f3',
            [ShipType.heavyFighter]: '#c72525',
            [ShipType.cruiser]: '#fbbc04',
            [ShipType.battleship]: '#9ecc00',
            [ShipType.bomber]: '#00a95e',
            [ShipType.battlecruiser]: '#075263',
            [ShipType.destroyer]: '#de5200',
            [ShipType.reaper]: '#16a8d4',
            [ShipType.pathfinder]: '#ad135e',
            [ShipType.smallCargo]: '#888888',
            [ShipType.largeCargo]: '#ffffff',
            [ShipType.espionageProbe]: '#4b17da',
            [ShipType.deathStar]: '#250909',
            [ShipType.recycler]: '#8aff8e',
            [ShipType.colonyShip]: '#d7b58e',
            [ShipType.crawler]: '#94b4ff',
            [ShipType.solarSatellite]: '#dd94ff',
        };

        private filterCombat(combat: CombatReport): boolean {
            return !combat.isExpedition;
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
                showAverage: false,
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