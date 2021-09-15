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
    import { TabViewItem } from "@/components/common/TabView.vue";
    import DebrisFieldOverviewChart from "./DebrisFieldOverviewChart.vue";
    import DebrisFieldOverviewTables from "./DebrisFieldOverviewTables.vue";

    @Component({
        components: {
            DebrisFieldOverviewChart,
            DebrisFieldOverviewTables,
        },
    })
    export default class DebrisFieldOverview extends Vue {
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