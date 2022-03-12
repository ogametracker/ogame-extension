<template>
    <stats-chart
        :datasets="datasets"
        :firstDay="firstDay"
        :itemsPerDay="reportsPerDay"
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { DebrisFieldReport } from '@/shared/models/v1/debris-field-reports/DebrisFieldReport';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {
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