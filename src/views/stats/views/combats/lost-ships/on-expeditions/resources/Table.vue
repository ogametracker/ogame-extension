<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="items"
            :filter="(combat) => filterCombat(combat)"
            :items="items"
            :footerItems="footerItems"
            show-average
        >
            <template #cell-label="{ value }">
                <span v-text="value" />

                <o-resource :resource="value" size="24px" />
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
            <date-range-settings class="two-column" />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { multiplyCost } from '@/shared/models/ogame/common/Cost';
    import { Ships } from '@/shared/models/ogame/ships/Ships';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            MsuConversionRateSettings,
            LostShipResourceUnitsFactorSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get factors() {
            return SettingsDataModule.settings.lostShipsResourceUnits;
        }

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private filterCombat(combat: CombatReport): boolean {
            return combat.isExpedition;
        }

        private get firstDay() {
            return CombatReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return CombatReportDataModule.reportsPerDay;
        }

        private get items(): RangedStatsTableItem<CombatReport>[] {
            const factors: Record<ResourceType, number> = {
                [ResourceType.metal]: this.factors.factor,
                [ResourceType.crystal]: this.factors.factor,
                [ResourceType.deuterium]: this.factors.deuteriumFactor,
            };

            return Object.values(ResourceType).map(resource => ({
                label: resource,
                getValue: reports => reports.reduce(
                    (acc, report) => acc + getNumericEnumValues<ShipType>(ShipType).reduce(
                        (acc, ship) => acc + multiplyCost(Ships[ship].getCost(), report.lostShips[ship] ?? 0)[resource] * factors[resource],
                        0
                    ), 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<CombatReport>[] {
            const factors: Record<ResourceType, number> = {
                [ResourceType.metal]: this.factors.factor,
                [ResourceType.crystal]: this.factors.factor,
                [ResourceType.deuterium]: this.factors.deuteriumFactor,
            };

            return [
                {
                    label: `LOCA: Total`,
                    getValue: reports => reports.reduce(
                        (acc, report) => acc + getNumericEnumValues<ShipType>(ShipType).reduce(
                            (acc, ship) => {
                                const res = multiplyCost(Ships[ship].getCost(), report.lostShips[ship] ?? 0);
                                return acc
                                    + res.metal * factors.metal
                                    + res.crystal * factors.crystal
                                    + res.deuterium * factors.deuterium;
                            }), 0),
                },
                {
                    label: `LOCA: Total (MSU)`,
                    getValue: reports => reports.reduce(
                        (acc, report) => acc + getNumericEnumValues<ShipType>(ShipType).reduce(
                            (acc, ship) => {
                                const res = multiplyCost(Ships[ship].getCost(), report.lostShips[ship] ?? 0);
                                return acc
                                    + res.metal * factors.metal
                                    + res.crystal * this.msuConversionRates.crystal * factors.crystal
                                    + res.deuterium * this.msuConversionRates.deuterium * factors.deuterium;
                            }), 0),
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