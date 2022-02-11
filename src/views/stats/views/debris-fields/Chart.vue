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

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ResourceType, string> = {
            [ResourceType.metal]: '#de5200',
            [ResourceType.crystal]: '#249df3',
            [ResourceType.deuterium]: '#14bf73',
        };

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
                })),
                {
                    key: 'total',
                    label: 'LOCA: Total Units (MSU)',
                    color: '#999999',
                    filled: false,
                    getValue: (reports: DebrisFieldReport[]) => reports.reduce((acc, report) => acc + report.metal + report.crystal * 2, 0), //TODO: MSU from settings
                    stack: false,
                }
            ];
        }
    }
</script>