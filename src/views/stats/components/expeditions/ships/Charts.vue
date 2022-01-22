<template>
    <div style="height: 100%">
        <scrollable-chart
            :datasets="datasets"
            stacked
            filled
            :x-label-formatter="(x) => formatX(x)"
            :footer-provider="(values) => getFooter(values)"
        />
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventFleet, ExpeditionFindableShipType } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { Localization } from '@/views/stats/i18n/Localization';
    import { startOfDay } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays';
    import addDays from 'date-fns/esm/addDays/index';
    import { Component, Vue } from 'vue-property-decorator';
    import { ScrollableChartDataset } from '../../common/ScrollableChart.vue';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';

    @Component({})
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

        private get datasets(): ScrollableChartDataset[] {
            const perDay = ExpeditionDataModule.expeditionsPerDay;
            const firstDay = ExpeditionDataModule.firstDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

            const fleetExposPerDay = days.map(
                day => (perDay[day] ?? []).filter(
                    expo => expo.type == ExpeditionEventType.fleet
                ) as ExpeditionEventFleet[]
            );

            const shipTypes = getNumericEnumValues<ShipType>(ExpeditionFindableShipType);
            return shipTypes.map(ship => ({
                key: ship,
                values: fleetExposPerDay.map(expos => expos.reduce((acc, expo) => acc + (expo.fleet[ship] ?? 0), 0)),
                color: this.colors[ship],
                label: 'LOCA: ' + ship, //LOCA
            }));
        }

        private formatX(x: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, x);

            return Localization.dateFormatter.format(day);
        }

        private getFooter(values: Record<ShipType, number>): string {
            const count = Object.values(values).reduce((acc, cur) => acc + cur, 0);

            return Localization.numberFormatter.format(count) + ' LOCA: Ships'; //LOCA
        }
    }
</script>