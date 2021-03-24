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
                    title: this.$t('extension.chart') as string,
                },
                {
                    name: 'tables',
                    title: this.$t('extension.tables') as string,
                },
            ];
        }
    }
</script> 