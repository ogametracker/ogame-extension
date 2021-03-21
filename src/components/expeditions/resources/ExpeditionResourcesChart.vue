<template>
    <line-expo-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $n(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component } from "vue-property-decorator";
    import { VueLineChart } from "@/types/chartjs";
    import LineExpoChart, { LineExpoChartDataset } from '@/components/common/LineExpoChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import Resource from "@/models/Resource";

    @Component({
        components: {
            LineExpoChart,
        },
    })
    export default class ExpeditionResourcesChart extends VueLineChart {
        private readonly resources = [
            Resource.metal,
            Resource.crystal,
            Resource.deuterium,
        ];

        private get datasets(): LineExpoChartDataset[] {
            return this.resources.map(resource => ({
                label: this.$t(`resources['${resource}']`) as string,
                color: SettingsModule.settings.charts.colors.resources[resource],
                aggregator: expos => expos.filter(expo => expo.type == ExpoType.resources)
                    .reduce((acc, expo) => acc + expo.resources![resource], 0),
            }));
        }

        private getTooltipLabel(item: any, data: any) {
            const resource = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$n(value)} ${resource}`;
        }
    }
</script>