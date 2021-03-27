<template>
    <expo-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $i18n.formatNumber(value)"
        :tooltip-label="getTooltipLabel"
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
    import getNumericEnumValues from '@/utils/getNumericEnumValues';

    @Component({
        components: {
            ExpoLineChart,
        },
    })
    export default class ExpeditionFleetChart extends Vue {

        private readonly datasets: ExpoLineChartDataset[] = getNumericEnumValues<ExpoFindableShips>(ExpoFindableShips)
            .map(ship => {
            return {
                label: i18n.messages.ogame.ships[ship],
                fill: true,
                color: SettingsModule.settings.charts.colors.fleet[ship as unknown as Ship],
                aggregator: expos => (expos.filter(expo => expo.type == ExpoType.fleet) as ExpoEventFleet[])
                    .reduce((acc, expo) => acc + (expo.fleet[ship] ?? 0), 0)
            };
        });

        private getTooltipLabel(item: any, data: any) {
            const label = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${i18n.formatNumber(value)} ${label}`;
        }
    }
</script>