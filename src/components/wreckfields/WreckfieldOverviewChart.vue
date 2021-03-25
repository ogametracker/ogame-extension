<template>
    <wreckfield-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $n(value)"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import WreckfieldLineChart, { WreckfieldLineChartDataset } from './WreckfieldLineChart.vue';
    import SettingsModule from "@/store/modules/SettingsModule";

    @Component({
        components: {
            WreckfieldLineChart,
        },
    })
    export default class WreckfieldOverviewChart extends Vue {
        private get datasets(): WreckfieldLineChartDataset[] {
            return [{
                label: this.$t('ogame.resources.metal') as string,
                color: SettingsModule.settings.charts.colors.resources.metal,
                fill: true,
                aggregator: reports => reports.reduce((acc, report) => acc + report.metal, 0),
            }, {
                label: this.$t('ogame.resources.crystal') as string,
                color: SettingsModule.settings.charts.colors.resources.crystal,
                fill: true,
                aggregator: reports => reports.reduce((acc, report) => acc + report.crystal, 0),
            }];
        }
    }
</script>