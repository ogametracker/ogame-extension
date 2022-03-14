<template>
    <stats-chart
        :filter="(expo) => filterExpo(expo)"
        :datasets="datasets"
        :firstDay="firstDay"
        :itemsPerDay="exposPerDay"
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
                    <div>LOCA: Expeditions</div>
                </div>
                <hr />
            </template>

            <div class="footer-item">
                <div class="number" v-text="$number(getSum(datasets))" />
                <div>LOCA: Expeditions (Total)</div>
            </div>
        </template>
    </stats-chart>
</template>

<script lang="ts">
    import { ExpeditionEvent } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {
        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.events;
        }

        private get firstDay() {
            return ExpeditionDataModule.firstDay;
        }

        private get exposPerDay() {
            return ExpeditionDataModule.expeditionsPerDay;
        }

        private getVisibleDatasets(datasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
            return datasets.filter(d => d.visible);
        }

        private get datasets(): StatsChartDataset<ExpeditionEvent>[] {
            return Object.values(ExpeditionEventType).map(type => ({
                key: type,
                label: `LOCA: ${type}`, //LOCA
                color: this.colors[type],
                filled: true,
                getValue: expos => expos.filter(e => e.type == type).length,
                showAverage: true,
            }));
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return true;
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