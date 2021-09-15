<template>
    <expo-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $extension.$n(value)"
        :tooltip-footer="getTooltipFooter"
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
    export default class ExpeditionOverviewChart extends Vue {
        private get datasets(): ExpoLineChartDataset[] {
            return Object.values(ExpoType).map(expoType => ({
                label: this.$ogame.$t.expoTypes[expoType],
                fill: true,
                color: SettingsModule.settings.charts.colors.overview[expoType as ExpoType],
                aggregator: expos => expos.filter(expo => expo.type == expoType).length
            }));
        }

        private getTooltipFooter(items: any[]) {
            const total = items.reduce((acc, cur) => acc + parseInt(cur.value), 0);
            return `${total} ${this.$extension.$t.headers.expeditions}`;
        }

        private getTooltipLabel(item: any, data: any) {
            const label = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$extension.$n(value)} ${label}`;
        }
    }
</script>