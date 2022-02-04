<template>
    <expedition-chart :filter="(expo) => filterExpo(expo)" :datasets="datasets">
        <template #tooltip-footer="{ datasets }">
            <template
                v-if="getVisibleDatasets(datasets).length < datasets.length"
            >
                <div class="footer-item">
                    <div class="number" v-text="$number(getVisibleDatasets(datasets).length)" />
                    <div>LOCA: Expeditions</div>
                </div>
                <hr />
            </template>

            <div class="footer-item">
                <div class="number" v-text="$number(datasets.length)" />
                <div>LOCA: Expeditions (Total)</div>
            </div>
        </template>
    </expedition-chart>
</template>

<script lang="ts">
    import { ExpeditionEvent } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionChart, { ExpeditionDataset } from '@stats/components/expeditions/ExpeditionChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';

    @Component({
        components: {
            ExpeditionChart,
        },
    })
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

        private getVisibleDatasets(datasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
            return datasets.filter(d => d.visible);
        }

        private get datasets(): ExpeditionDataset[] {
            return Object.values(ExpeditionEventType).map(type => ({
                key: type,
                label: `LOCA: ${type}`, //LOCA
                color: this.colors[type],
                filled: true,
                getValue: expos => expos.filter(e => e.type == type).length,
            }));
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return true;
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