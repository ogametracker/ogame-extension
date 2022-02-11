<template>
    <ranged-stats-table
        :dataItems="debrisFieldReports"
        :items="items"
        :footerItems="footerItems"
        show-average
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { DebrisFieldReport } from '@/shared/models/v1/debris-field-reports/DebrisFieldReport';
    import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
    import { DebrisFieldReportDataModule } from '@stats/data/DebrisFieldReportDataModule';

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
        private get items(): RangedStatsTableItem<DebrisFieldReport>[] {
            const resources: (ResourceType.metal | ResourceType.crystal)[] = [ResourceType.metal, ResourceType.crystal];

            return resources.map(resource => ({
                label: `LOCA: ${resource}`,
                getValue: reports => reports
                    .reduce((acc, report) => acc + report[resource], 0),
            }));
        }

        private get debrisFieldReports() {
            return DebrisFieldReportDataModule.reports;
        }

        private get footerItems(): RangedStatsTableItem<DebrisFieldReport>[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: reports => reports.reduce((acc, report) => acc + report.metal + report.crystal, 0),
                },
                {
                    label: `LOCA: Total (MSU)`,
                    getValue: reports => reports.reduce((acc, report) => acc + report.metal + report.crystal * 2, 0), //TODO: MSU from settings
                },
            ];
        }
    }
</script>