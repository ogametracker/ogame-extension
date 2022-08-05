<template>
    <div class="chart-container">
        <stats-chart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="reportsPerDay">
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="$i18n.$n(getResourcesAmount(getVisibleDatasets(datasets)))" />
                        <div v-text="$i18n.$t.common.resourceUnits" />

                        <div class="number" v-text="$i18n.$n(getResourcesAmountInMsu(getVisibleDatasets(datasets)))" />
                        <div v-text="$i18n.$t.common.resourceUnitsMsu" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$i18n.$n(getResourcesAmount(datasets))" />
                    <div v-text="`${$i18n.$t.common.resourceUnits} (${$i18n.$t.common.total})`" />

                    <div class="number" v-text="$i18n.$n(getResourcesAmountInMsu(datasets))" />
                    <div v-text="`${$i18n.$t.common.resourceUnitsMsu} (${$i18n.$t.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <conversion-rate-settings />
            <hr />
            <combat-tracking-ignore-espionage-combats-settings />
            <hr />
            <resource-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';
    import { getMsuOrDsu } from '@/views/stats/models/settings/getMsuOrDsu';

    @Component({
        components: {
            StatsChart,
            ResourceColorSettings,
            ConversionRateSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get firstDay() {
            return CombatReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return CombatReportDataModule.dailyResults;
        }

        private get datasets(): StatsChartDataset<DailyCombatReportResult>[] {
            return [
                ...ResourceTypes.map(resource => ({
                    key: resource,
                    label: this.$i18n.$t.resources[resource],
                    color: this.colors[resource],
                    filled: true,
                    getValue: (result: DailyCombatReportResult) => result.loot[resource],
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: `${this.$i18n.$t.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.common.msu : this.$i18n.$t.common.dsu})`,
                    color: this.colors.totalMsu,
                    filled: false,
                    getValue: result => getMsuOrDsu(result.loot),
                    stack: false,
                    showAverage: true,
                }
            ];
        }

        private getVisibleDatasets(datasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
            return datasets.filter(d => d.visible);
        }

        private getResourcesAmount(datasets: ScollableChartFooterDataset[]): number {
            const resources: string[] = [ResourceType.metal, ResourceType.crystal, ResourceType.deuterium];
            return datasets
                .filter(d => resources.includes(d.key.toString()))
                .reduce((acc, cur) => acc + cur.value, 0);
        }

        private getResourcesAmountInMsu(datasets: ScollableChartFooterDataset[]): number {
            return datasets.reduce((acc, cur) => {
                if (!(ResourceTypes as (string | number)[]).includes(cur.key)) {
                    return acc;
                }
                return acc + getMsuOrDsu({ [cur.key as ResourceType]: cur.value });
            }, 0);
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