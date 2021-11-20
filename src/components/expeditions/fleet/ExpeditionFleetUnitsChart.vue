<template>
    <expo-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="value => $i18n.$n(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpoLineChart, { ExpoLineChartDataset } from '@/components/expeditions/ExpoLineChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import ExpoEvent, { ExpoEventFleet } from "@/models/expeditions/ExpoEvent";
    import Resource from "@/models/Resource";
    import ShipDictionary from '@/models/ogame/buildables/ShipDictionary';
    import Ship from "@/models/Ship";

    @Component({
        components: {
            ExpoLineChart,
        },
    })
    export default class ExpeditionFleetUnitsChart extends Vue {

        private readonly datasets: ExpoLineChartDataset[] = Object.values(Resource)
            .map(resource => ({
                label: this.$i18n.$t.resources[resource],
                fill: true,
                color: SettingsModule.settings.charts.colors.resources[resource],
                aggregator: (expos: ExpoEvent[]) => (expos.filter(expo => expo.type == ExpoType.fleet) as ExpoEventFleet[])
                    .reduce(
                        (acc, expo) => acc +
                            (Object.keys(expo.fleet) as any as Ship[])
                                .reduce((a, ship) => a + ShipDictionary[ship].cost[resource], 0)
                        , 0)
            }));

        private getTooltipLabel(item: any, data: any) {
            const label = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$i18n.$n(value)} ${label}`;
        }
    }
</script>