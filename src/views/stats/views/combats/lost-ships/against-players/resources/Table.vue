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

            <msu-conversion-rate-settings />
            <lost-ship-resource-units-factor-settings />
            <hr class="two-column" />
            <combat-tracking-ignore-espionage-combats-settings />
            <show-msu-cells-settings />
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
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';
    import ShowMsuCellsSettings from '@stats/components/settings/ShowMsuCellsSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            MsuConversionRateSettings,
            LostShipResourceUnitsFactorSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
            ShowMsuCellsSettings,
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

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get firstDay() {
            return CombatReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return CombatReportDataModule.dailyResultsArray;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {
                [this.$i18n.$t.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get items(): RangedStatsTableItem<DailyCombatReportResult>[] {
            const factors: Record<ResourceType, number> = {
                [ResourceType.metal]: this.factors.factor,
                [ResourceType.crystal]: this.factors.factor,
                [ResourceType.deuterium]: this.factors.deuteriumFactor,
            };

            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.resources[resource],
                getValue: reports => reports.reduce(
                    (acc, report) => acc
                        + report.lostShips.againstPlayers.resourceUnits[resource] * factors[resource],
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
                    label: this.$i18n.$t.common.resourceUnits,
                    getValue: reports => reports.reduce(
                        (acc, report) => acc
                            + report.lostShips.againstPlayers.resourceUnits.metal * factors.metal
                            + report.lostShips.againstPlayers.resourceUnits.crystal * factors.crystal
                            + report.lostShips.againstPlayers.resourceUnits.deuterium * factors.deuterium,
                        0
                    ),
                },
            ];

            if(SettingsDataModule.settings.showMsuCells) {
                result.push({
                    label: this.$i18n.$t.common.resourceUnitsMsu,
                    getValue: reports => reports.reduce(
                        (acc, report) => acc
                            + report.lostShips.againstPlayers.resourceUnits.metal * factors.metal
                            + report.lostShips.againstPlayers.resourceUnits.crystal * factors.crystal * this.msuConversionRates.crystal
                            + report.lostShips.againstPlayers.resourceUnits.deuterium * factors.deuterium * this.msuConversionRates.deuterium,
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