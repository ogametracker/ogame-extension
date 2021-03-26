<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <expedition-overview-chart />
        </template>
        <template #tables>
            <expedition-overview-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "@/components/common/TabView.vue";
    import ExpeditionOverviewChart from "./ExpeditionOverviewChart.vue";
    import ExpeditionOverviewTables from "./ExpeditionOverviewTables.vue";
    import i18n from "@/i18n";

    @Component({
        components: {
            ExpeditionOverviewChart,
            ExpeditionOverviewTables,
            TabView,
        },
    })
    export default class ExpeditionOverview extends Vue {
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