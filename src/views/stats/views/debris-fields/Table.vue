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

                <conversion-rate-settings />
                <show-converted-resources-in-cells-settings />
                <separate-expedition-and-normal-debris-field-settings />
                <hr class="three-column" />
                <date-range-settings class="three-column" />
            </floating-menu>
            <manually-add-debris-field-menu />
        </span>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
    import { DailyDebrisFieldReportResult, DebrisFieldReportDataModule } from '@stats/data/DebrisFieldReportDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import ManuallyAddDebrisFieldMenu from '@stats/components/debris-fields/ManuallyAddDebrisFieldMenu.vue';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
    import SeparateExpeditionAndNormalDebrisFieldSettings from '@stats/components/settings/debris-fields/SeparateExpeditionAndNormalDebrisFieldSettings.vue';
    import { getMsuOrDsu } from '@stats/models/settings/getMsuOrDsu';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ConversionRateSettings,
            ManuallyAddDebrisFieldMenu,
            ShowConvertedResourcesInCellsSettings,
            SeparateExpeditionAndNormalDebrisFieldSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get resourceTypes(): Record<string, ResourceType> {
            return {
                [this.$i18n.$t.extension.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.extension.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.extension.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get separate() {
            return SettingsDataModule.settings.debrisFields.separateExpeditionDebrisFields;
        }

        private get items(): RangedStatsTableItem<DailyDebrisFieldReportResult>[] {
            if (this.separate) {
                return ResourceTypes.map(resource => ({
                    label: this.$i18n.$t.extension.resources[resource],
                    items: (['normal', 'expedition', 'total'] as ('normal' | 'expedition' | 'total')[]).map(key => ({
                        label: {
                            normal: `${this.$i18n.$t.extension.debrisFields.position} 1-15`,
                            expedition: `${this.$i18n.$t.extension.debrisFields.position} 16`,
                            total: this.$i18n.$t.extension.common.sum,
                        }[key],
                        getValue: reports => reports.reduce((acc, report) => acc + report[key][resource], 0),
                        class: key == 'total' ? 'sum-item' : '',
                        labelClass: key == 'total' ? 'sum-item' : '',
                    })),
                }));
            }

            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.extension.resources[resource],
                getValue: reports => reports.reduce((acc, report) => acc + report.total[resource], 0),
            }));
        }

        private get debrisFieldReports() {
            return DebrisFieldReportDataModule.dailyResultsArray;
        }

        private get footerItems(): RangedStatsTableItem<DailyDebrisFieldReportResult>[] {
            const result: RangedStatsTableItem<DailyDebrisFieldReportResult>[] = [
                {
                    label: this.$i18n.$t.extension.common.resourceUnits,
                    getValue: reports => reports.reduce((acc, report) => acc + report.total.metal + report.total.crystal + report.total.deuterium, 0),
                },
            ];

            if (SettingsDataModule.settings.showCellsWithConvertedResourceUnits) {
                result.push({
                    label: `${this.$i18n.$t.extension.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.extension.common.msu : this.$i18n.$t.extension.common.dsu})`,
                    getValue: reports => reports.reduce((acc, report) => acc + getMsuOrDsu(report.total), 0),
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

        &::v-deep {
            .sum-item {
                font-weight: bold;
                border-top: 1px solid rgba(var(--color), 0.5);
                margin-top: 1px;
            }
        }
    }

    .multi-menu {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .floating-settings::v-deep .floating-menu {
        display: grid;
        grid-template-columns: repeat(3, auto);
        column-gap: 8px;

        .three-column {
            grid-column: 1 / span 3;
        }

        hr {
            width: 100%;
        }
    }
</style>