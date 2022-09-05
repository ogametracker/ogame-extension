<template>
    <div class="chart-container">
        <stats-chart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="exposPerDay">
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="$i18n.$n(getTotal(getVisibleDatasets(datasets)))" />
                        <div v-text="$i18n.$t.empire.lifeforms.experiencePoints" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$i18n.$n(getTotal(datasets))" />
                    <div v-text="`${$i18n.$t.empire.lifeforms.experiencePoints} (${$i18n.$t.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <lifeform-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { DailyLifeformDiscoveryResult, LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import LifeformColorSettings from '@stats/components/settings/colors/LifeformColorSettings.vue';
    import { ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';

    @Component({
        components: {
            StatsChart,
            LifeformColorSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.lifeforms;
        }

        private get firstDay() {
            return LifeformDiscoveryDataModule.firstDay;
        }

        private get exposPerDay() {
            return LifeformDiscoveryDataModule.dailyResults;
        }

        private get datasets(): StatsChartDataset<DailyLifeformDiscoveryResult>[] {
            return ValidLifeformTypes.map(lifeform => ({
                key: lifeform,
                label: this.$i18n.$t.lifeforms[lifeform],
                color: this.colors[lifeform],
                filled: true,
                getValue: (result: DailyLifeformDiscoveryResult) => result.lifeformExperience[lifeform],
                showAverage: true,
            }));
        }

        private getVisibleDatasets(datasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
            return datasets.filter(d => d.visible);
        }

        private getTotal(datasets: ScollableChartFooterDataset[]): number {
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