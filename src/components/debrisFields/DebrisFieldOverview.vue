<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <debris-field-overview-chart />
        </template>
        <template #tables>
            <debris-field-overview-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "@/components/common/TabView.vue";
    import DebrisFieldOverviewChart from "./DebrisFieldOverviewChart.vue";
    import DebrisFieldOverviewTables from "./DebrisFieldOverviewTables.vue";
    import i18n from "@/i18n";

    @Component({
        components: {
            DebrisFieldOverviewChart,
            DebrisFieldOverviewTables,
            TabView,
        },
    })
    export default class DebrisFieldOverview extends Vue {
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