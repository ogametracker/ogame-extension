<template>
    <div class="chart-container">
        <stats-chart :firstDay="firstDay" :itemsPerDay="missionsPerDay" :datasets="datasets" stacked show-average>
            <template #tooltip-footer="{ datasets }">
                <div class="footer-item">
                    <div class="number" v-text="$i18n.$n(getSum(getVisibleDatasets(datasets)))" />
                    <div v-text="$i18n.$t.extension.empire.lifeforms.artifacts" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <LifeformDiscoveryColorSettings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { DailyLifeformDiscoveryResult, LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import LifeformDiscoveryColorSettings from '@/views/stats/components/settings/colors/LifeformDiscoveryColorSettings.vue';

    @Component({
        components: {
            StatsChart,
            LifeformDiscoveryColorSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get color() {
            return SettingsDataModule.settings.colors.lifeformDiscoveries.events.artifacts;
        }

        private get firstDay() {
            return LifeformDiscoveryDataModule.firstDay;
        }

        private get missionsPerDay() {
            return LifeformDiscoveryDataModule.dailyResults;
        }

        private get datasets(): StatsChartDataset<DailyLifeformDiscoveryResult>[] {
            return [{
                key: 'artifacts',
                label: this.$i18n.$t.extension.empire.lifeforms.artifacts,
                color: this.color,
                filled: true,
                getValue: (result: DailyLifeformDiscoveryResult) => result.artifacts,
                showAverage: true,
            }];
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