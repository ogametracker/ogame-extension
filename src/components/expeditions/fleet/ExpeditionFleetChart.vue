<template>
    <line-expo-chart stacked :datasets="datasets" :y-tick-formatter="(value) => $n(value)"  />
</template>
<script lang="ts">
    import { Component } from "vue-property-decorator";
    import { VueLineChart } from "@/types/chartjs";
    import LineExpoChart, { LineExpoChartDataset } from '@/components/common/LineExpoChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import Ship from "@/models/Ship";

    @Component({
        components: {
            LineExpoChart,
        },
    })
    export default class ExpeditionFleetChart extends VueLineChart {
        private readonly findableShips = [
            Ship.lightFighter,
            Ship.heavyFighter,
            Ship.cruiser,
            Ship.battleship,
            Ship.bomber,
            Ship.battlecruiser,
            Ship.destroyer,
            Ship.reaper,
            Ship.pathfinder,
            Ship.smallCargo,
            Ship.largeCargo,
            Ship.espionageProbe,
        ];

        private readonly datasets: LineExpoChartDataset[] = this.findableShips.map(ship => ({
            label: ship,
            name: ship,
            color: SettingsModule.settings.charts.colors.fleet[ship]!,
            aggregator: expos => expos.filter(expo => expo.type == ExpoType.fleet)
                .reduce((acc, expo) => acc + (expo.fleet![ship as Ship] ?? 0), 0)
        }));
    }
</script>