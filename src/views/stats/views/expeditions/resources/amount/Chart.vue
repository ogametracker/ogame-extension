<template>
    <div class="chart-container">
        <stats-chart
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
                                $i18n.$n(
                                    getResourcesAmount(
                                        getVisibleDatasets(datasets)
                                    )
                                )
                            "
                        />
                        <div v-text="$i18n.$t.common.resourceUnits" />

                        <div
                            class="number"
                            v-text="
                                $i18n.$n(
                                    getResourcesAmountInMsu(
                                        getVisibleDatasets(datasets)
                                    )
                                )
                            "
                        />
                        <div v-text="$i18n.$t.common.resourceUnitsMsu" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div
                        class="number"
                        v-text="$i18n.$n(getResourcesAmount(datasets))"
                    />
                    <div
                        v-text="
                            `${$i18n.$t.common.resourceUnits} (${$i18n.$t.common.total})`
                        "
                    />

                    <div
                        class="number"
                        v-text="$i18n.$n(getResourcesAmountInMsu(datasets))"
                    />
                    <div
                        v-text="
                            `${$i18n.$t.common.resourceUnitsMsu} (${$i18n.$t.common.total})`
                        "
                    />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <msu-conversion-rate-settings />
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
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';

    @Component({
        components: {
            StatsChart,
            ResourceColorSettings,
            MsuConversionRateSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get firstDay() {
            return ExpeditionDataModule.firstDay;
        }

        private get exposPerDay() {
            return ExpeditionDataModule.dailyResults;
        }

        private get datasets(): StatsChartDataset<DailyExpeditionResult>[] {
            return [
                ...ResourceTypes.map(resource => ({
                    key: resource,
                    label: this.$i18n.$t.resources[resource],
                    color: this.colors[resource],
                    filled: true,
                    getValue: (result: DailyExpeditionResult) => result.findings.resources[resource],
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: this.$i18n.$t.common.resourceUnitsMsu,
                    color: this.colors.totalMsu,
                    filled: false,
                    getValue: result => result.findings.resources.metal
                        + result.findings.resources.crystal * this.msuConversionRates.crystal
                        + result.findings.resources.deuterium * this.msuConversionRates.deuterium,
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
            const msu: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                ...this.msuConversionRates,
            };
            return datasets.reduce((acc, cur) => {
                if (!(cur.key in msu)) {
                    return acc;
                }
                return acc + cur.value * msu[cur.key as ResourceType];
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