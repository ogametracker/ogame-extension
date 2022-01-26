<template>
    <div style="height: 100%">
        <scrollable-chart
            :datasets="datasets"
            stacked
            filled
            :x-label-formatter="(x) => formatX(x)"
        >
            <template #footer="{ datasets }">
                <div class="tooltip-footer">
                    <template v-if="datasets.some((d) => !d.visible)">
                        <div class="value">{{ getTotal(datasets, false) }}</div>
                        <div>LOCA: Expeditions</div>
                    </template>
                    <hr />
                    <div class="value">{{ getTotal(datasets, true) }}</div>
                    <div>LOCA: Expeditions (total)</div>
                </div>
            </template>
        </scrollable-chart>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { startOfDay } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays';
    import addDays from 'date-fns/esm/addDays/index';
    import { Component, Vue } from 'vue-property-decorator';
    import { ScollableChartFooterDataset, ScrollableChartDataset } from '@stats/components/common/ScrollableChart.vue';

    @Component({})
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ExpeditionEventType, string> = {
            [ExpeditionEventType.nothing]: '#2472f3',
            [ExpeditionEventType.resources]: '#c72525',
            [ExpeditionEventType.fleet]: '#fbbc04',
            [ExpeditionEventType.delay]: '#9ecc00',
            [ExpeditionEventType.early]: '#00a95e',
            [ExpeditionEventType.darkMatter]: '#075263',
            [ExpeditionEventType.pirates]: '#de5200',
            [ExpeditionEventType.aliens]: '#16a8d4',
            [ExpeditionEventType.item]: '#ad135e',
            [ExpeditionEventType.trader]: '#888888',
            [ExpeditionEventType.lostFleet]: '#ffffff',
        };

        private getTotal(datasets: ScollableChartFooterDataset[], includeHidden: boolean): string {
            const sum = datasets
                .filter(d => d.visible || includeHidden)
                .reduce((acc, d) => acc + d.value, 0);

            return this.$number(sum);
        }

        private get datasets(): ScrollableChartDataset[] {
            const perDay = ExpeditionDataModule.expeditionsPerDay;
            const firstDay = ExpeditionDataModule.firstDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

            const types = Object.values(ExpeditionEventType);
            const perTypePerDay = types.map(
                type => days.map(
                    day => (perDay[day] ?? []).filter(expo => expo.type == type).length
                )
            );

            return types
                .map((type, i) => ({
                    key: type,
                    values: perTypePerDay[i],
                    color: this.colors[type],
                    label: 'LOCA: ' + type, //LOCA
                }));
        }

        private formatX(x: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, x);

            return this.$date(day);
        }
    }
</script>
<style lang="scss" scoped>
    .tooltip-footer {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 6px;

        .value {
            text-align: right;
        }

        hr {
            grid-column: 1 / span 2;
            width: 100%;
        }
    }
</style>