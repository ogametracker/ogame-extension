<template>
    <expo-line-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $i18n.$n(value)"
        :tooltip-label="getTooltipLabel"
        :hide-zeros-in-tooltip="false"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpoLineChart, { ExpoLineChartDataset } from '@/components/expeditions/ExpoLineChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import Resource from "@/models/Resource";
    import { ExpoEventResources } from "@/models/expeditions/ExpoEvent";
    

    @Component({
        components: {
            ExpoLineChart,
        },
    })
    export default class ExpeditionResourcesChart extends Vue {
        private get datasets(): ExpoLineChartDataset[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    fill: true,
                    label: this.$i18n.$t.resources[resource],
                    color: SettingsModule.settings.charts.colors.resources[resource],
                    aggregator: expos => (expos.filter(expo => expo.type == ExpoType.resources) as ExpoEventResources[])
                        .reduce((acc, expo) => acc + expo.resources[resource], 0),
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