<template>
    <tab-view :items="items" vertical>
        <template #chart>
            <resource-overview-chart
                stacked
                :datasets="datasets"
                :y-tick-formatter="(value) => $i18n.$n(value)"
                :tooltip-label="getTooltipLabel"
                :hide-zeros-in-tooltip="false"
            />
        </template>
        <template #tables>
            <resource-overview-table />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { TabViewItem } from "../common/TabView.vue";
    import ResourceOverviewChart, { ResourcesOverviewChartDataset } from './ResourceOverviewChart.vue';
    import ResourceOverviewTable from './ResourceOverviewTable.vue';
    
    import Resource from "@/models/Resource";
    import SettingsModule from "@/store/modules/SettingsModule";
    import { ExpoEventResources } from "@/models/expeditions/ExpoEvent";
    import ExpoType from "@/models/expeditions/ExpoType";


    @Component({
        components: {
            ResourceOverviewChart,
            ResourceOverviewTable,
        },
    })
    export default class ResourceOverviewStats extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'chart',
                    title: this.$i18n.$t.chart,
                },
                {
                    name: 'tables',
                    title: this.$i18n.$t.tables,
                },
            ];
        }


        private get datasets(): ResourcesOverviewChartDataset[] {
            return Object.keys(Resource).map(resourceName => {
                const resource = resourceName as Resource;
                return {
                    fill: true,
                    label: this.$i18n.$t.resources[resource],
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
            return `${this.$i18n.$n(value)} ${resource}`;
        }
    }
</script>