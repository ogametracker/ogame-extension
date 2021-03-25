<template>
    <expo-line-chart
        :datasets="datasets"
        :y-tick-formatter="(value) => $n(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpoLineChart, { ExpoLineChartDataset } from '@/components/expeditions/ExpoLineChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";

    @Component({
        components: {
            ExpoLineChart,
        },
    })
    export default class ExpeditionTypeDistributionChart extends Vue {

        private readonly datasets: ExpoLineChartDataset[] = Object.keys(ExpoType).map(expoType => ({
            label: this.$t(`ogame.expoTypes['${expoType}']`) as string,
            color: SettingsModule.settings.charts.colors.overview[expoType as ExpoType],
            fill: false,
            aggregator: expos => 100 * expos.filter(expo => expo.type == expoType).length / Math.max(expos.length, 10)
        }));

        private getTooltipLabel(item: any, data: any) {
            const expoType = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$n(value)}% ${expoType}`;
        }
    }
</script>