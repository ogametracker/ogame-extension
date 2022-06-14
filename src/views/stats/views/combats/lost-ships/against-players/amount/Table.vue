<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="combats"
            :filter="(combat) => filterCombat(combat)"
            :items="items"
            :footerItems="footerItems"
            show-average
        >
            <template #cell-label="{ value }">
                <span v-text="value" />

                <o-ship :ship="shipTable[value]" size="24px" />
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
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { OShipType } from '@/views/stats/components/common/ogame/OShip.vue';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get combats() {
            return CombatReportDataModule.reports;
        }

        private filterCombat(combat: CombatReport): boolean {
            return !combat.isExpedition;
        }

        private get items(): RangedStatsTableItem<CombatReport>[] {
            return getNumericEnumValues<ShipType>(ShipType).map(ship => ({
                label: this.$i18n.$t.ships[ship],
                getValue: combats => combats.reduce((acc, combat) => acc + combat.lostShips[ship], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<CombatReport>[] {
            return [
                {
                    label: `LOCA: Total`,
                    getValue: combats => combats.reduce(
                        (acc, combat) => acc + Object.values(combat.lostShips).reduce((acc, cur) => acc + cur, 0),
                        0
                    ),
                },
            ];
        }

        private readonly shipTable: Record<ShipType, OShipType> = {
            [ShipType.lightFighter]: OShipType['light-fighter'],
            [ShipType.heavyFighter]: OShipType['heavy-fighter'],
            [ShipType.cruiser]: OShipType.cruiser,
            [ShipType.battleship]: OShipType.battleship,
            [ShipType.bomber]: OShipType.bomber,
            [ShipType.battlecruiser]: OShipType.battlecruiser,
            [ShipType.destroyer]: OShipType.destroyer,
            [ShipType.reaper]: OShipType.reaper,
            [ShipType.pathfinder]: OShipType.pathfinder,
            [ShipType.smallCargo]: OShipType['small-cargo'],
            [ShipType.largeCargo]: OShipType['large-cargo'],
            [ShipType.espionageProbe]: OShipType['espionage-probe'],
            [ShipType.recycler]: OShipType.recycler,
            [ShipType.deathStar]: OShipType['death-star'],
            [ShipType.crawler]: OShipType.crawler,
            [ShipType.solarSatellite]: OShipType['solar-satellite'],
            [ShipType.colonyShip]: OShipType['colony-ship'],
        };
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