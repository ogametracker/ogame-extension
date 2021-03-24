<template>
    <line-expo-chart
        stacked
        :datasets="datasets"
        hide-legend
        :y-tick-formatter="(value) => $n(value)"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import LineExpoChart, { LineExpoChartDataset } from '@/components/common/LineExpoChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
import { ExpoEventDarkMatter } from "@/models/expeditions/ExpoEvent";

    @Component({
        components: {
            LineExpoChart,
        },
    })
    export default class ExpeditionDarkMatterChart extends Vue {
        private readonly datasets: LineExpoChartDataset[] = [{
            label: this.$t('ogame.premium.darkMatter') as string,
            fill: true,
            color: SettingsModule.settings.charts.colors.darkMatter,
            aggregator: expos => (expos.filter(expo => expo.type == ExpoType.darkMatter) as ExpoEventDarkMatter[])
                .reduce((acc, cur) => acc + cur.darkMatter, 0)
        }];
    }
</script>