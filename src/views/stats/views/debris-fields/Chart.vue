<template>
    <div class="chart-container">
        <stats-chart
            :datasets="datasets"
            :firstDay="firstDay"
            :itemsPerDay="reportsPerDay"
        />

        <span class="multi-menu">
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

            <manually-add-debris-field-menu />
        </span>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { DebrisFieldReport } from '@/shared/models/debris-field-reports/DebrisFieldReport';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ManuallyAddDebrisFieldMenu from '@stats/components/debris-fields/ManuallyAddDebrisFieldMenu.vue';

    @Component({
        components: {
            StatsChart,
            ResourceColorSettings,
            MsuConversionRateSettings,
            ManuallyAddDebrisFieldMenu,
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
            return DebrisFieldReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return DebrisFieldReportDataModule.reportsPerDay;
        }

        private get datasets(): StatsChartDataset<DebrisFieldReport>[] {
            const resources: (ResourceType.metal | ResourceType.crystal)[] = [ResourceType.metal, ResourceType.crystal];

            return [
                ...resources.map(resource => ({
                    key: resource,
                    label: `LOCA: ${resource}`, //LOCA
                    color: this.colors[resource],
                    filled: true,
                    getValue: (reports: DebrisFieldReport[]) => reports.reduce((acc, report) => acc + report[resource], 0),
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: 'LOCA: Total Units (MSU)',
                    color: this.colors.totalMsu,
                    filled: false,
                    getValue: (reports: DebrisFieldReport[]) => reports.reduce((acc, report) => acc + report.metal + report.crystal * this.msuConversionRates.crystal, 0),
                    stack: false,
                    showAverage: true,
                }
            ];
        }
    }
</script>
<style lang="scss" scoped>
    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }

    .multi-menu {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
</style>