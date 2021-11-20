<template>
    <expo-line-chart
        stacked
        :datasets="datasets"
        hide-legend
        :y-tick-formatter="(value) => $i18n.$n(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpoLineChart, { ExpoLineChartDataset } from '@/components/expeditions/ExpoLineChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import { ExpoEventDarkMatter } from "@/models/expeditions/ExpoEvent";
    

    @Component({
        components: {
            ExpoLineChart,
        },
    })
    export default class ExpeditionDarkMatterChart extends Vue {
        private readonly datasets: ExpoLineChartDataset[] = [{
            label: this.$i18n.$t.premium.darkMatter,
            fill: true,
            color: SettingsModule.settings.charts.colors.overview.darkMatter,
            aggregator: expos => (expos.filter(expo => expo.type == ExpoType.darkMatter) as ExpoEventDarkMatter[])
                .reduce((acc, cur) => acc + cur.darkMatter, 0)
        }];

        private getTooltipLabel(item: any, data: any) {
            const label = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$i18n.$n(value)} ${label}`;
        }
    }
</script>