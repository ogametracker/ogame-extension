<template>
    <expo-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $n(value)"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpoLineChart, { ExpoLineChartDataset } from '@/components/expeditions/ExpoLineChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import Ship from "@/models/Ship";
    import { ExpoEventFleet, ExpoFindableShips } from "@/models/expeditions/ExpoEvent";

    @Component({
        components: {
            ExpoLineChart,
        },
    })
    export default class ExpeditionFleetChart extends Vue {

        private readonly datasets: ExpoLineChartDataset[] = Object.keys(ExpoFindableShips).map(shipName => {
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