<template>
    <wreckfield-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $i18n.formatNumber(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import WreckfieldLineChart, { WreckfieldLineChartDataset } from './WreckfieldLineChart.vue';
    import SettingsModule from "@/store/modules/SettingsModule";
import i18n from "@/i18n";

    @Component({
        components: {
            WreckfieldLineChart,
        },
    })
    export default class WreckfieldOverviewChart extends Vue {
        private get datasets(): WreckfieldLineChartDataset[] {
            return [{
                label: i18n.messages.ogame.resources.metal,
                color: SettingsModule.settings.charts.colors.resources.metal,
                fill: true,
                aggregator: reports => reports.reduce((acc, report) => acc + report.metal, 0),
            }, {
                label: i18n.messages.ogame.resources.crystal,
                color: SettingsModule.settings.charts.colors.resources.crystal,
                fill: true,
                aggregator: reports => reports.reduce((acc, report) => acc + report.crystal, 0),
            }];
        }

        private getTooltipLabel(item: any, data: any) {
            const resource = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${i18n.formatNumber(value)} ${resource}`;
        }
    }
</script>