<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <expedition-resources-chart />
        </template>
        <template #tables>
            <expedition-resources-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import TabView, { TabViewItem } from "@/components/common/TabView.vue";
import i18n from "@/i18n";
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionResourcesChart from "./ExpeditionResourcesChart.vue";
    import ExpeditionResourcesTables from "./ExpeditionResourcesTables.vue";

    @Component({
        components: {
            ExpeditionResourcesChart,
            ExpeditionResourcesTables,
            TabView,
        },
    })
    export default class ExpeditionResources extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'chart',
                    title: i18n.messages.extension.chart,
                },
                {
                    name: 'tables',
                    title: i18n.messages.extension.tables,
                },
            ];
        }
    }
</script> 