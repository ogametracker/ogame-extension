<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <battles-resources-chart />
        </template>
        <template #tables>
            <battles-resources-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { TabViewItem } from "@/components/common/TabView.vue";
    import { Component, Vue } from "vue-property-decorator";
    import BattlesResourcesChart from "./BattlesResourcesChart.vue";
    import BattlesResourcesTables from "./BattlesResourcesTables.vue";

    @Component({
        components: {
            BattlesResourcesChart,
            BattlesResourcesTables,
        },
    })
    export default class BattlesResources extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'chart',
                    title: this.$extension.$t.chart,
                },
                {
                    name: 'tables',
                    title: this.$extension.$t.tables,
                },
            ];
        }
    }
</script> 