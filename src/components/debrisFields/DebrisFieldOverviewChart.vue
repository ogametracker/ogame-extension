<template>
    <debris-field-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $extension.$n(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import DebrisFieldLineChart, { DebrisFieldLineChartDataset } from './DebrisFieldLineChart.vue';
    import SettingsModule from "@/store/modules/SettingsModule";

    @Component({
        components: {
            DebrisFieldLineChart,
        },
    })
    export default class DebrisFieldOverviewChart extends Vue {
        private get datasets(): DebrisFieldLineChartDataset[] {
            return [{
                label: this.$ogame.$t.resources.metal,
                color: SettingsModule.settings.charts.colors.resources.metal,
                fill: true,
                aggregator: reports => reports.reduce((acc, report) => acc + report.metal, 0),
            }, {
                label: this.$ogame.$t.resources.crystal,
                color: SettingsModule.settings.charts.colors.resources.crystal,
                fill: true,
                aggregator: reports => reports.reduce((acc, report) => acc + report.crystal, 0),
            }];
        }

        private getTooltipLabel(item: any, data: any) {
            const resource = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$extension.$n(value)} ${resource}`;
        }
    }
</script>