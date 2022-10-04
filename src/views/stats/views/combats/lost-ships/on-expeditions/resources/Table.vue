<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="reportsPerDay" :items="items" :footerItems="footerItems" show-average :averageNumberFormatOptions="avgNumberFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-resource :resource="resourceTypes[value]" size="24px" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <conversion-rate-settings />
            <lost-ship-resource-units-factor-settings />
            <hr class="two-column" />
            <combat-tracking-ignore-espionage-combats-settings />
            <show-converted-resources-in-cells-settings />
            <hr class="two-column" />
            <date-range-settings class="two-column" />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import { getMsuOrDsu } from '@/views/stats/models/settings/getMsuOrDsu';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ConversionRateSettings,
            LostShipResourceUnitsFactorSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
            ShowConvertedResourcesInCellsSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get factors() {
            return SettingsDataModule.settings.lostShipsResourceUnits;
        }

        private get firstDay() {
            return CombatReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return CombatReportDataModule.dailyResultsArray;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {
                [this.$i18n.$t.extension.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.extension.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.extension.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get items(): RangedStatsTableItem<DailyCombatReportResult>[] {
            const factors: Record<ResourceType, number> = {
                [ResourceType.metal]: this.factors.factor,
                [ResourceType.crystal]: this.factors.factor,
                [ResourceType.deuterium]: this.factors.deuteriumFactor,
            };

            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.extension.resources[resource],
                getValue: reports => reports.reduce(
                    (acc, report) => acc + report.lostShips.onExpeditions.resourceUnits[resource] * factors[resource],
                    0
                ),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyCombatReportResult>[] {
            const factors: Record<ResourceType, number> = {
                [ResourceType.metal]: this.factors.factor,
                [ResourceType.crystal]: this.factors.factor,
                [ResourceType.deuterium]: this.factors.deuteriumFactor,
            };

            const result: RangedStatsTableItem<DailyCombatReportResult>[] = [
                {
                    label: this.$i18n.$t.extension.common.resourceUnits,
                    getValue: reports => reports.reduce(
                        (acc, report) => acc
                            + report.lostShips.onExpeditions.resourceUnits.metal * factors.metal
                            + report.lostShips.onExpeditions.resourceUnits.crystal * factors.crystal
                            + report.lostShips.onExpeditions.resourceUnits.deuterium * factors.deuterium,
                        0
                    ),
                },
            ];

            if(SettingsDataModule.settings.showCellsWithConvertedResourceUnits) {
                result.push({
                    label: `${this.$i18n.$t.extension.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.extension.common.msu : this.$i18n.$t.extension.common.dsu})`,
                    getValue: reports => reports.reduce(
                        (acc, report) => acc + getMsuOrDsu(report.lostShips.onExpeditions.resourceUnits, factors),
                        0
                    ),
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