<template>
    <ranged-stats-table
        :dataItems="expos"
        :filter="(expo) => filterExpo(expo)"
        :items="items"
        :footerItems="footerItems"
        show-average
        :averageNumberFormatOptions="avgFormat"
    >
        <template #cell-label="{ value }">
            <span v-text="value" />

            <o-ship :ship="shipTable[value]" size="24px" />
        </template>
    </ranged-stats-table>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionEvent, ExpeditionEventFleet, ExpeditionFindableShipType } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { OShipType } from '@/views/stats/components/common/ogame/OShip.vue';
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
        private readonly ExpeditionFindableShipType = ExpeditionFindableShipType;

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
                label: ship.toString(),
                getValue: expos => expos.reduce((acc, expo) => acc + (expo.fleet[ship] ?? 0), 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEventFleet>[] {
            return [{
                label: `LOCA: Total`,
                getValue: expos => expos.reduce(
                    (acc, expo) => acc + getNumericEnumValues(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + (expo.fleet[ship] ?? 0)
                        , 0)
                    , 0),
            }];
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