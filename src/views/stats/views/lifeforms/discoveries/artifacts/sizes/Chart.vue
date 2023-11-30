<template>
    <div class="chart-container">
        <stats-chart :firstDay="firstDay" :itemsPerDay="missionsPerDay" :datasets="datasets" stacked show-average>
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="$i18n.$n(getSum(getVisibleDatasets(datasets)))" />
                        <div v-text="$i18n.$t.extension.expeditions.finds" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$i18n.$n(getSum(datasets))" />
                    <div v-text="`${$i18n.$t.extension.expeditions.finds} (${$i18n.$t.extension.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            Coming soon
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { DailyLifeformDiscoveryResult, LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import { LifeformDiscoveryEventArtifactFindingSizes } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize';

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.lifeformDiscoveries.artifactFindingSizes;
        }

        private get firstDay() {
            return LifeformDiscoveryDataModule.firstDay;
        }

        private get missionsPerDay() {
            return LifeformDiscoveryDataModule.dailyResults;
        }

        private get datasets(): StatsChartDataset<DailyLifeformDiscoveryResult>[] {
            return LifeformDiscoveryEventArtifactFindingSizes.map(size => ({
                key: size,
                label: this.$i18n.$t.extension.empire.lifeforms.artifactFindingSizes[size],
                color: this.colors[size],
                filled: true,
                getValue: result => result.artifactSizes[size],
                showAverage: true,
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

    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>