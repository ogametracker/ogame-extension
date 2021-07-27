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
    import i18n from "@/i18n";
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