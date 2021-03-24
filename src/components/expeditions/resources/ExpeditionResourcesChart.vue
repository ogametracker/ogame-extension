<template>
    <line-expo-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $n(value)"
        :tooltip-label="getTooltipLabel"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import LineExpoChart, { LineExpoChartDataset } from '@/components/common/LineExpoChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import Resource from "@/models/Resource";
    import { ExpoEventResources } from "@/models/expeditions/ExpoEvent";

    @Component({
        components: {
            LineExpoChart,
        },
    })
    export default class ExpeditionResourcesChart extends Vue {
        private get datasets(): LineExpoChartDataset[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    fill: true,
                    label: this.$t(`ogame.resources['${resource}']`) as string,
                    color: SettingsModule.settings.charts.colors.resources[resource],
                    aggregator: expos => (expos.filter(expo => expo.type == ExpoType.resources) as ExpoEventResources[])
                        .reduce((acc, expo) => acc + expo.resources[resource], 0),
                };
            });
        }

        private getTooltipLabel(item: any, data: any) {
            const resource = data.datasets[item.datasetIndex].label;
            const value: number = item.value;
            return `${this.$n(value)} ${resource}`;
        }
    }
</script>