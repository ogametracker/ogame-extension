<template>
    <line-expo-chart
        stacked
        :datasets="datasets"
        hide-legend
        :y-tick-formatter="(value) => $n(value)"
    />
</template>
<script lang="ts">
    import { Component } from "vue-property-decorator";
    import { VueLineChart } from "@/types/chartjs";
    import LineExpoChart, { LineExpoChartDataset } from '@/components/common/LineExpoChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";

    @Component({
        components: {
            LineExpoChart,
        },
    })
    export default class ExpeditionDarkMatterChart extends VueLineChart {
        private readonly datasets: LineExpoChartDataset[] = [{
            label: 'Dunkle Materie',
            name: 'darkMatter',
            color: SettingsModule.settings.charts.colors.darkMatter,
            aggregator: expos => expos.filter(expo => expo.type == ExpoType.darkMatter)
                .reduce((acc, cur) => acc + cur.darkMatter!, 0)
        }];
    }
</script>