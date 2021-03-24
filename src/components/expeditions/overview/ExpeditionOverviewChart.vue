<template>
    <line-expo-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $n(value)"
        :tooltip-footer="getTooltipFooter"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import LineExpoChart, { LineExpoChartDataset } from '@/components/common/LineExpoChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";

    @Component({
        components: {
            LineExpoChart,
        },
    })
    export default class ExpeditionOverviewChart extends Vue {
        private get datasets(): LineExpoChartDataset[] {
            return Object.keys(ExpoType).map(expoType => ({
                label: this.$t(`ogame.expoTypes['${expoType}']`) as string,
                fill: true,
                color: SettingsModule.settings.charts.colors.overview[expoType as ExpoType],
                aggregator: expos => expos.filter(expo => expo.type == expoType).length
            }));
        }

        private getTooltipFooter(items: any[]) {
            const total = items.reduce((acc, cur) => acc + parseInt(cur.value), 0);
            return `${total} ${this.$t('extension.expeditions')}`;
        }
    }
</script>