<template>
    <div class="chart-container">
        <stats-chart
            :firstDay="firstDay"
            :itemsPerDay="exposPerDay"
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
                                $i18n.$n(getSum(getVisibleDatasets(datasets)))
                            "
                        />
                        <div v-text="$i18n.$t.expeditions.finds" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$i18n.$n(getSum(datasets))" />
                    <div v-text="`${$i18n.$t.expeditions.finds} (${$i18n.$t.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <expedition-event-size-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEvent, ExpeditionEventFleet } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ExpeditionEventSize } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import ExpeditionEventSizeColorSettings from '@stats/components/settings/colors/ExpeditionEventSizeColorSettings.vue';

    @Component({
        components: {
            StatsChart,
            ExpeditionEventSizeColorSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.sizes;
        }

        private get firstDay() {
            return ExpeditionDataModule.firstDay;
        }

        private get exposPerDay() {
            return ExpeditionDataModule.expeditionsPerDay;
        }

        private get datasets(): StatsChartDataset<ExpeditionEventFleet>[] {
            return Object.values(ExpeditionEventSize).map(size => ({
                key: size,
                label:  this.$i18n.$t.expeditions.expeditionEventSizes[size],
                color: this.colors[size],
                filled: true,
                getValue: expos => expos.filter(e => e.size == size).length,
                showAverage: true,
            }));
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.fleet;
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