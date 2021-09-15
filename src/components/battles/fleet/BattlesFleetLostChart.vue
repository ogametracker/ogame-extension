<template>
    <battles-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $i18n.$n(value)"
        :tooltip-label="getTooltipLabel"
        :force-min="0"
    />
</template>
<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import BattlesLineChart, { BattlesLineChartDataset } from '@/components/battles/BattlesLineChart.vue';
    import SettingsModule from "@/store/modules/SettingsModule";
    import Ship from "@/models/Ship";
    import getNumericEnumValues from "@/utils/getNumericEnumValues";

    @Component({
        components: {
            BattlesLineChart,
        },
    })
    export default class BattlesFleetLostChart extends Vue {
        @Prop({ required: false, type: Boolean, default: false })
        private players!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private expeditions!: boolean;

        private get datasets(): BattlesLineChartDataset[] {
            return getNumericEnumValues<Ship>(Ship).map(ship => {
                return {
                    fill: true,
                    label: this.$i18n.$t.ships[ship],
                    color: SettingsModule.settings.charts.colors.ships[ship],
                    aggregator: reports => reports.filter(report => report.isExpedition ? this.expeditions : this.players)
                        .reduce((acc, report) => acc + report.lostShips[ship], 0),
                };
            });
        }

        private getTooltipLabel(item: any, data: any) {
            const resource = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$i18n.$n(value)} ${resource}`;
        }
    }
</script>