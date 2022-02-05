<template>
    <expedition-chart
        :filter="(expo) => filterExpo(expo)"
        :datasets="datasets"
        stacked
        show-average
    >
        <template #tooltip-footer="{ datasets }">
            <template
                v-if="getVisibleDatasets(datasets).length < datasets.length"
            >
                <div class="footer-item">
                    <div
                        class="number"
                        v-text="
                            $number(
                                getSum(getVisibleDatasets(datasets))
                            )
                        "
                    />
                    <div>LOCA: Resource Discoveries</div>
                </div>
                <hr />
            </template>

            <div class="footer-item">
                <div
                    class="number"
                    v-text="$number(getSum(datasets))"
                />
                <div>LOCA: Resource Discoveries (Total)</div>
            </div>
        </template>
    </expedition-chart>
</template>

<script lang="ts">
    import { ExpeditionEvent, ExpeditionEventResources } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionChart, { ExpeditionDataset } from '@stats/components/expeditions/ExpeditionChart.vue';
    import { ExpeditionEventSize } from '@/shared/models/v1/expeditions/ExpeditionEventSize';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';

    @Component({
        components: {
            ExpeditionChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ExpeditionEventSize, string> = {
            [ExpeditionEventSize.small]: '#90A4AE',
            [ExpeditionEventSize.medium]: '#3949AB',
            [ExpeditionEventSize.large]: '#F50057',
        };

        private get datasets(): ExpeditionDataset[] {
            return Object.values(ExpeditionEventSize).map(size => ({
                key: size,
                label: `LOCA: ${size}`, //LOCA
                color: this.colors[size],
                filled: true,
                getValue: expos => (expos as ExpeditionEventResources[]).filter(e => e.size == size).length,
            }));
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.resources;
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