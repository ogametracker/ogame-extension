<template>
    <div class="table-container">
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

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { DebrisFieldReport } from '@/shared/models/debris-field-reports/DebrisFieldReport';
    import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
    import { DebrisFieldReportDataModule } from '@stats/data/DebrisFieldReportDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

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
<style lang="scss" scoped>
    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>