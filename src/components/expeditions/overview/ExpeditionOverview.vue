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
    import { TabViewItem } from "@/components/common/TabView.vue";
    import ExpeditionOverviewChart from "./ExpeditionOverviewChart.vue";
    import ExpeditionOverviewTables from "./ExpeditionOverviewTables.vue";
    

    @Component({
        components: {
            ExpeditionOverviewChart,
            ExpeditionOverviewTables,
        },
    })
    export default class ExpeditionOverview extends Vue {
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
    }
</script> 