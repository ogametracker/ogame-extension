<template>
    <line-expo-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $n(value)"
        :tooltip-footer="getTooltipFooter"
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
    export default class ExpeditionOverviewChart extends VueLineChart {
        private get datasets(): LineExpoChartDataset[] {
            return Object.keys(ExpoType).map(expoType => ({
                label: this.$t(`expoTypes['${expoType}']`) as string,
                name: expoType,
                color: SettingsModule.settings.charts.colors.overview[expoType as ExpoType],
                aggregator: expos => expos.filter(expo => expo.type == expoType).length
            }));
        }

        private getTooltipFooter(items: any[]) {
            const total = items.reduce((acc, cur) => acc + parseInt(cur.value), 0);
            return `${total} ${this.$t('expeditions')}`;
        }
    }
</script>