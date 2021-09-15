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
    import { TabViewItem } from "@/components/common/TabView.vue";
    
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionResourcesChart from "./ExpeditionResourcesChart.vue";
    import ExpeditionResourcesTables from "./ExpeditionResourcesTables.vue";

    @Component({
        components: {
            ExpeditionResourcesChart,
            ExpeditionResourcesTables,
        },
    })
    export default class ExpeditionResources extends Vue {
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