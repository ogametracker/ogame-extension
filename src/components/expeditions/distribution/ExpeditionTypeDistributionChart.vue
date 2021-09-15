<template>
    <expo-line-chart
        :datasets="datasets"
        :y-tick-formatter="(value) => $extension.$n(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpoLineChart, { ExpoLineChartDataset } from '@/components/expeditions/ExpoLineChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import i18n from "@/i18n";

    @Component({
        components: {
            ExpoLineChart,
        },
    })
    export default class ExpeditionTypeDistributionChart extends Vue {

        private readonly datasets: ExpoLineChartDataset[] = Object.values(ExpoType).map(expoType => ({
            label: this.$ogame.$t.expoTypes[expoType],
            color: SettingsModule.settings.charts.colors.overview[expoType as ExpoType],
            fill: false,
            aggregator: expos => 100 * expos.filter(expo => expo.type == expoType).length / Math.max(expos.length, 10)
        }));

        private getTooltipLabel(item: any, data: any) {
            const expoType = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$extension.$n(value)}% ${expoType}`;
        }
    }
</script>