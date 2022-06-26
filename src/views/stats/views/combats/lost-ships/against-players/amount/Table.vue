<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="combats"
            :items="items"
            :footerItems="footerItems"
            show-average
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-ship :ship="shipTable[value]" size="24px" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <combat-tracking-ignore-espionage-combats-settings />
            <hr />
            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import { ShipType, ShipTypes } from '@/shared/models/ogame/ships/ShipType';
    import { OShipType } from '@/views/_shared/components/ogame/OShip.vue';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private get combats() {
            return CombatReportDataModule.dailyResultsArray;
        }

        private get items(): RangedStatsTableItem<DailyCombatReportResult>[] {
            return ShipTypes.map(ship => ({
                label: this.$i18n.$t.ships[ship],
                getValue: combats => combats.reduce((acc, combat) => acc + combat.lostShips.againstPlayers.ships[ship], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyCombatReportResult>[] {
            return [
                {
                    label: this.$i18n.$t.common.sum,
                    getValue: combats => ShipTypes.reduce(
                        (total, ship) => total + combats.reduce(
                            (acc, combat) => acc + combat.lostShips.againstPlayers.ships[ship], 0),
                        0
                    ),
                },
            ];
        }

        private get shipTable(): Record<string, OShipType> {
            return {
                [this.$i18n.$t.ships[ShipType.lightFighter]]: OShipType['light-fighter'],
                [this.$i18n.$t.ships[ShipType.heavyFighter]]: OShipType['heavy-fighter'],
                [this.$i18n.$t.ships[ShipType.cruiser]]: OShipType.cruiser,
                [this.$i18n.$t.ships[ShipType.battleship]]: OShipType.battleship,
                [this.$i18n.$t.ships[ShipType.bomber]]: OShipType.bomber,
                [this.$i18n.$t.ships[ShipType.battlecruiser]]: OShipType.battlecruiser,
                [this.$i18n.$t.ships[ShipType.destroyer]]: OShipType.destroyer,
                [this.$i18n.$t.ships[ShipType.reaper]]: OShipType.reaper,
                [this.$i18n.$t.ships[ShipType.pathfinder]]: OShipType.pathfinder,
                [this.$i18n.$t.ships[ShipType.smallCargo]]: OShipType['small-cargo'],
                [this.$i18n.$t.ships[ShipType.largeCargo]]: OShipType['large-cargo'],
                [this.$i18n.$t.ships[ShipType.espionageProbe]]: OShipType['espionage-probe'],
                [this.$i18n.$t.ships[ShipType.recycler]]: OShipType.recycler,
                [this.$i18n.$t.ships[ShipType.deathStar]]: OShipType['death-star'],
                [this.$i18n.$t.ships[ShipType.crawler]]: OShipType.crawler,
                [this.$i18n.$t.ships[ShipType.solarSatellite]]: OShipType['solar-satellite'],
                [this.$i18n.$t.ships[ShipType.colonyShip]]: OShipType['colony-ship'],
            };
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