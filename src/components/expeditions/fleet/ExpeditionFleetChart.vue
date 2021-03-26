<template>
    <expo-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $i18n.formatNumber(value)"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpoLineChart, { ExpoLineChartDataset } from '@/components/expeditions/ExpoLineChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import Ship from "@/models/Ship";
    import { ExpoEventFleet, ExpoFindableShips } from "@/models/expeditions/ExpoEvent";
import i18n from "@/i18n";

    @Component({
        components: {
            ExpoLineChart,
        },
    })
    export default class ExpeditionFleetChart extends Vue {

        private readonly datasets: ExpoLineChartDataset[] = Object.keys(ExpoFindableShips).map(shipName => {
            const ship = shipName as unknown as ExpoFindableShips;
            return {
                label: i18n.messages.ogame.ships[ship],
                fill: true,
                color: SettingsModule.settings.charts.colors.fleet[ship as unknown as Ship],
                aggregator: expos => (expos.filter(expo => expo.type == ExpoType.fleet) as ExpoEventFleet[])
                    .reduce((acc, expo) => acc + expo.fleet[ship], 0)
            };
        });
    }
</script>