<template>
    <resource-overview-chart
        stacked
        :datasets="datasets"
        :y-tick-formatter="(value) => $i18n.formatNumber(value)"
        :tooltip-label="getTooltipLabel"
        :hide-zeros-in-tooltip="false"
    />
</template>
<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ResourceOverviewChart, { ResourcesOverviewChartDataset } from './ResourceOverviewChart.vue';
    import ExpoType from "@/models/expeditions/ExpoType";
    import SettingsModule from "@/store/modules/SettingsModule";
    import Resource from "@/models/Resource";
    import { ExpoEventResources } from "@/models/expeditions/ExpoEvent";
    import i18n from "@/i18n";

    @Component({
        components: {
            ResourceOverviewChart,
        },
    })
    export default class ResourcesOverview extends Vue {
        private get datasets(): ResourcesOverviewChartDataset[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    fill: true,
                    label: i18n.messages.ogame.resources[resource],
                    color: SettingsModule.settings.charts.colors.resources[resource],
                    aggregator: (expos, battles, debris) => {
                        const expoResources = (expos.filter(expo => expo.type == ExpoType.resources) as ExpoEventResources[])
                            .reduce((acc, expo) => acc + expo.resources[resource], 0);

                        const battleResources = battles.reduce((acc, report) => acc + report.loot[resource], 0);

                        const debrisResources = debris.reduce((acc, report) => acc + ((report as any)[resource] ?? 0), 0);

                        return expoResources + battleResources + debrisResources;
                    },
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