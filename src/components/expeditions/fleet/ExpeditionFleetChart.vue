<template>
    <line-expo-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $n(value)"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import LineExpoChart, { LineExpoChartDataset } from '@/components/common/LineExpoChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import Ship from "@/models/Ship";

    @Component({
        components: {
            LineExpoChart,
        },
    })
    export default class ExpeditionFleetChart extends Vue {
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
            label: this.$t(`ogame.ships['${ship}']`) as string,
            fill: true,
            color: SettingsModule.settings.charts.colors.fleet[ship]!,
            aggregator: expos => expos.filter(expo => expo.type == ExpoType.fleet)
                .reduce((acc, expo) => acc + (expo.fleet![ship as Ship] ?? 0), 0)
        }));
    }
</script>