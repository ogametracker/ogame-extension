<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="expos"
            :filter="(expo) => filterExpo(expo)"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgFormat"
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

            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionEvent, ExpeditionEventFleet, ExpeditionFindableShipType } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { OShipType } from '@/views/stats/components/common/ogame/OShip.vue';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private readonly ExpeditionFindableShipType = ExpeditionFindableShipType;
        private showSettings = false;

        private avgFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.fleet;
        }

        private get expos() {
            return ExpeditionDataModule.expeditions;
        }

        private get items(): RangedStatsTableItem<ExpeditionEventFleet>[] {
            return getNumericEnumValues(ExpeditionFindableShipType).map(ship => ({
                label: this.$i18n.$t.ships[ship as ShipType],
                getValue: expos => expos.reduce((acc, expo) => acc + (expo.fleet[ship] ?? 0), 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEventFleet>[] {
            return [{
                label: this.$i18n.$t.common.sum,
                getValue: expos => expos.reduce(
                    (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + (expo.fleet[ship] ?? 0)
                        , 0)
                    , 0),
            }];
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