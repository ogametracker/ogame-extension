<template>
    <battles-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $i18n.formatNumber(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import BattlesLineChart, { BattlesLineChartDataset } from '@/components/battles/BattlesLineChart.vue';
    import SettingsModule from "@/store/modules/SettingsModule";
    import Resource from "@/models/Resource";
    import i18n from "@/i18n";

    @Component({
        components: {
            BattlesLineChart,
        },
    })
    export default class BattlesFleetPlayersDestroyedChart extends Vue {
        private get datasets(): BattlesLineChartDataset[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    fill: true,
                    label: i18n.messages.ogame.resources[resource],
                    color: SettingsModule.settings.charts.colors.resources[resource],
                    aggregator: reports => reports.filter(report => !report.isExpedition)
                        .reduce((acc, report) => acc + report.destroyedShips, 0),
                };
            });
        }

        private getTooltipLabel(item: any, data: any) {
            const resource = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${i18n.formatNumber(value)} ${resource}`;
        }
    }
</script>