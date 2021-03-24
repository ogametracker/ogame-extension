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
    import { ExpoEventFleet, ExpoFindableShips } from "@/models/expeditions/ExpoEvent";

    @Component({
        components: {
            LineExpoChart,
        },
    })
    export default class ExpeditionFleetChart extends Vue {

        private readonly datasets: LineExpoChartDataset[] = Object.keys(ExpoFindableShips).map(shipName => {
            const ship = shipName as unknown as ExpoFindableShips;
            return {
                label: this.$t(`ogame.ships['${ship}']`) as string,
                fill: true,
                color: SettingsModule.settings.charts.colors.fleet[ship as unknown as Ship],
                aggregator: expos => (expos.filter(expo => expo.type == ExpoType.fleet) as ExpoEventFleet[])
                    .reduce((acc, expo) => acc + expo.fleet[ship], 0)
            };
        });
    }
</script>