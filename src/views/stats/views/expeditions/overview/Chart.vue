<template>
    <div class="chart-container">
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
                            v-text="
                                $number(getSum(getVisibleDatasets(datasets)))
                            "
                        />
                        <div v-text="$i18n.$t.expeditions.expeditions" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$number(getSum(datasets))" />
                    <div v-text="`${$i18n.$t.expeditions.expeditions} (${$i18n.$t.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <expedition-event-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEvent } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import ExpeditionEventColorSettings from '@stats/components/settings/colors/ExpeditionEventColorSettings.vue';

    @Component({
        components: {
            StatsChart,
            ExpeditionEventColorSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

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
                label: this.$i18n.$t.expeditions.expeditionEvents[type],
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

    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>