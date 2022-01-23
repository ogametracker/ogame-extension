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
                        <div class="value">{{ getTotal(datasets, false, false) }}</div>
                        <div>LOCA: Units</div>

                        <div class="value">{{ getTotal(datasets, false, true) }}</div>
                        <div>LOCA: Units (MSU)</div>
                    </template>
                    <hr />
                        <div class="value">{{ getTotal(datasets, true, false) }}</div>
                        <div>LOCA: Units (total)</div>

                        <div class="value">{{ getTotal(datasets, true, true) }}</div>
                        <div>LOCA: Units (total MSU)</div>
                </div>
            </template>
        </scrollable-chart>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventResources } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { Localization } from '@/views/stats/i18n/Localization';
    import { startOfDay } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays';
    import addDays from 'date-fns/esm/addDays/index';
    import { Component, Vue } from 'vue-property-decorator';
    import { ScollableChartFooterDataset, ScrollableChartDataset } from '../../common/ScrollableChart.vue';

    @Component({})
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ResourceType, string> = {
            [ResourceType.metal]: '#de5200',
            [ResourceType.crystal]: '#249df3',
            [ResourceType.deuterium]: '#14bf73',
        };

        private get datasets(): ScrollableChartDataset[] {
            const perDay = ExpeditionDataModule.expeditionsPerDay;
            const firstDay = ExpeditionDataModule.firstDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

            const resourceExposPerDay = days.map(
                day => (perDay[day] ?? []).filter(
                    expo => expo.type == ExpeditionEventType.resources
                ) as ExpeditionEventResources[]
            );

            return Object.values(ResourceType)
                .map(resource => ({
                    key: resource,
                    values: resourceExposPerDay.map(expos => expos.reduce((acc, expo) => acc + expo.resources[resource], 0)),
                    color: this.colors[resource],
                    label: 'LOCA: ' + resource, //LOCA
                }));
        }

        private formatX(x: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, x);

            return Localization.dateFormatter.format(day);
        }

        private getTotal(datasets: ScollableChartFooterDataset[], includeHidden: boolean, msu: boolean): string {
            //TODO: from settings
            const msuFactors: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                [ResourceType.crystal]: 2,
                [ResourceType.deuterium]: 3,
            };

            const sum = datasets
                .filter(d => d.visible || includeHidden)
                .reduce((acc, d) => acc + d.value * (msu ? msuFactors[d.key as ResourceType] : 1), 0);

            return Localization.numberFormatter.format(sum);
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