<template>
    <ranged-stats-table
        :dataItems="debrisFieldReports"
        :items="items"
        :footerItems="footerItems"
        show-average
    >
        <template #cell-label="{ value }">
            <span v-text="value" />

            <o-resource :resource="value" size="24px" />
        </template>
    </ranged-stats-table>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { DebrisFieldReport } from '@/shared/models/v1/debris-field-reports/DebrisFieldReport';
    import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
    import { DebrisFieldReportDataModule } from '@stats/data/DebrisFieldReportDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get items(): RangedStatsTableItem<DebrisFieldReport>[] {
            const resources: (ResourceType.metal | ResourceType.crystal)[] = [ResourceType.metal, ResourceType.crystal];

            return resources.map(resource => ({
                label: resource,
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
                    getValue: reports => reports.reduce((acc, report) => acc + report.metal + report.crystal * this.msuConversionRates.crystal, 0),
                },
            ];
        }
    }
</script>