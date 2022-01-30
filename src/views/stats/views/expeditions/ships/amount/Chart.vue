<template>
    <expedition-chart
        :filter="(expo) => filterExpo(expo)"
        :datasets="datasets"
        stacked
        show-average
    />
</template>

<script lang="ts">
    import { ExpeditionEvent, ExpeditionEventFleet, ExpeditionEventResources, ExpeditionFindableShipType } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionChart, { ExpeditionDataset } from '@stats/components/expeditions/ExpeditionChart.vue';
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';

    @Component({
        components: {
            ExpeditionChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ShipType, string> = {
            [ShipType.lightFighter]: '#2472f3',
            [ShipType.heavyFighter]: '#c72525',
            [ShipType.cruiser]: '#fbbc04',
            [ShipType.battleship]: '#9ecc00',
            [ShipType.bomber]: '#00a95e',
            [ShipType.battlecruiser]: '#075263',
            [ShipType.destroyer]: '#de5200',
            [ShipType.reaper]: '#16a8d4',
            [ShipType.pathfinder]: '#ad135e',
            [ShipType.smallCargo]: '#888888',
            [ShipType.largeCargo]: '#ffffff',
            [ShipType.espionageProbe]: '#4b17da',
            [ShipType.deathStar]: '#250909',
            [ShipType.recycler]: '#8aff8e',
            [ShipType.colonyShip]: '#d7b58e',
            [ShipType.crawler]: '#94b4ff',
            [ShipType.solarSatellite]: '#dd94ff',
        };

        private get datasets(): ExpeditionDataset[] {
            return getNumericEnumValues<ShipType>(ExpeditionFindableShipType).map(ship => ({
                key: `${ship}`,
                label: `LOCA: ${ship}`, //LOCA
                color: this.colors[ship],
                filled: true,
                getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventFleet[])
                    .reduce((acc, expo) => acc + (expo.fleet[ship] ?? 0), 0),
            }));
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.fleet;
        }
    }
</script>