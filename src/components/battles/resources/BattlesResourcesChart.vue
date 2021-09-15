<template>
    <battles-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $extension.$n(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import BattlesLineChart, { BattlesLineChartDataset } from '@/components/battles/BattlesLineChart.vue';
    import SettingsModule from "@/store/modules/SettingsModule";
    import Resource from "@/models/Resource";

    @Component({
        components: {
            BattlesLineChart,
        },
    })
    export default class BattlesResourcesChart extends Vue {
        private get datasets(): BattlesLineChartDataset[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    fill: true,
                    label: this.$ogame.$t.resources[resource],
                    color: SettingsModule.settings.charts.colors.resources[resource],
                    aggregator: reports => reports.reduce((acc, report) => acc + report.loot[resource], 0),
                };
            });
        }

        private getTooltipLabel(item: any, data: any) {
            const resource = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$extension.$n(value)} ${resource}`;
        }
    }
</script>