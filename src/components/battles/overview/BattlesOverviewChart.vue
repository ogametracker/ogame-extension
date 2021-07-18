<template>
    <battles-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $i18n.formatNumber(value)"
        :tooltip-footer="getTooltipFooter"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import BattlesLineChart, { BattlesLineChartDataset } from '@/components/battles/BattlesLineChart.vue';
    import SettingsModule from "@/store/modules/SettingsModule";
    import i18n from "@/i18n";
    import BattleResult from "@/models/battles/BattleResult";

    @Component({
        components: {
            BattlesLineChart,
        },
    })
    export default class BattlesOverviewChart extends Vue {
        @Prop({ required: false, type: Boolean, default: false })
        private players!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private expeditions!: boolean;

        private readonly results: BattleResult[] = [
            'won',
            'lost',
            'draw',
        ];

        private get datasets(): BattlesLineChartDataset[] {
            return this.results.map(battleResult => ({
                label: i18n.messages.ogame.battleResults[battleResult],
                fill: true,
                color: SettingsModule.settings.charts.colors.battleResults[battleResult],
                aggregator: report => report.filter(report => report.result == battleResult
                    && (report.isExpedition ? this.expeditions : this.players)).length
            }));
        }

        private getTooltipFooter(items: any[]) {
            const total = items.reduce((acc, cur) => acc + parseInt(cur.value), 0);
            return `${total} ${i18n.messages.extension.headers.battles}`;
        }

        private getTooltipLabel(item: any, data: any) {
            const label = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${i18n.formatNumber(value)} ${label}`;
        }
    }
</script>