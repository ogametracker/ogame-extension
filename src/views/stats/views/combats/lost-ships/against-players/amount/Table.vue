<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="combats" :items="items" :footerItems="footerItems" show-average :averageNumberFormatOptions="avgNumberFormat">
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

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

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

        private get shipTable(): Record<string, ShipType> {
            return {
                [this.$i18n.$t.ships[ShipType.lightFighter]]: ShipType.lightFighter,
                [this.$i18n.$t.ships[ShipType.heavyFighter]]: ShipType.heavyFighter,
                [this.$i18n.$t.ships[ShipType.cruiser]]: ShipType.cruiser,
                [this.$i18n.$t.ships[ShipType.battleship]]: ShipType.battleship,
                [this.$i18n.$t.ships[ShipType.bomber]]: ShipType.bomber,
                [this.$i18n.$t.ships[ShipType.battlecruiser]]: ShipType.battlecruiser,
                [this.$i18n.$t.ships[ShipType.destroyer]]: ShipType.destroyer,
                [this.$i18n.$t.ships[ShipType.reaper]]: ShipType.reaper,
                [this.$i18n.$t.ships[ShipType.pathfinder]]: ShipType.pathfinder,
                [this.$i18n.$t.ships[ShipType.smallCargo]]: ShipType.smallCargo,
                [this.$i18n.$t.ships[ShipType.largeCargo]]: ShipType.largeCargo,
                [this.$i18n.$t.ships[ShipType.espionageProbe]]: ShipType.espionageProbe,
                [this.$i18n.$t.ships[ShipType.recycler]]: ShipType.recycler,
                [this.$i18n.$t.ships[ShipType.deathStar]]: ShipType.deathStar,
                [this.$i18n.$t.ships[ShipType.crawler]]: ShipType.crawler,
                [this.$i18n.$t.ships[ShipType.solarSatellite]]: ShipType.solarSatellite,
                [this.$i18n.$t.ships[ShipType.colonyShip]]: ShipType.colonyShip,
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