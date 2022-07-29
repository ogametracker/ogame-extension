<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="debrisFieldReports"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgNumberFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-resource :resource="resourceTypes[value]" size="24px" />
            </template>
        </ranged-stats-table>

        <span class="multi-menu">
            <floating-menu v-model="showSettings" left class="floating-settings">
                <template #activator>
                    <button @click="showSettings = !showSettings">
                        <span class="mdi mdi-cog" />
                    </button>
                </template>

                <msu-conversion-rate-settings />
                <show-msu-cells-settings />
                <hr class="two-column" />
                <date-range-settings />
            </floating-menu>
            <manually-add-debris-field-menu />
        </span>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
    import { DailyDebrisFieldReportResult, DebrisFieldReportDataModule } from '@stats/data/DebrisFieldReportDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ManuallyAddDebrisFieldMenu from '@stats/components/debris-fields/ManuallyAddDebrisFieldMenu.vue';
    import ShowMsuCellsSettings from '@stats/components/settings/ShowMsuCellsSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            MsuConversionRateSettings,
            ManuallyAddDebrisFieldMenu,
            ShowMsuCellsSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;
        
        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {    
                [this.$i18n.$t.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get items(): RangedStatsTableItem<DailyDebrisFieldReportResult>[] {
            const resources: (ResourceType.metal | ResourceType.crystal)[] = [ResourceType.metal, ResourceType.crystal];

            return resources.map(resource => ({
                label: this.$i18n.$t.resources[resource],
                getValue: reports => reports
                    .reduce((acc, report) => acc + report[resource], 0),
            }));
        }

        private get debrisFieldReports() {
            return DebrisFieldReportDataModule.dailyResultsArray;
        }

        private get footerItems(): RangedStatsTableItem<DailyDebrisFieldReportResult>[] {
            const result: RangedStatsTableItem<DailyDebrisFieldReportResult>[] = [
                {
                    label: this.$i18n.$t.common.resourceUnits,
                    getValue: reports => reports.reduce((acc, report) => acc + report.metal + report.crystal, 0),
                },
            ];

            if(SettingsDataModule.settings.showMsuCells) {
                result.push({
                    label: this.$i18n.$t.common.resourceUnitsMsu,
                    getValue: reports => reports.reduce((acc, report) => acc + report.metal + report.crystal * this.msuConversionRates.crystal, 0),
                });
            }

            return result;
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

    .multi-menu {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .floating-settings::v-deep .floating-menu {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 8px;

        .two-column {
            grid-column: 1 / span 2;
        }

        hr {
            width: 100%;
        }
    }
</style>