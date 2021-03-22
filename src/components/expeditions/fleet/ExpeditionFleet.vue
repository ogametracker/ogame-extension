<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <expedition-fleet-chart />
        </template>
        <template #tables>
            <expedition-fleet-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import TabView, { TabViewItem } from "@/components/common/TabView.vue";
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionFleetChart from "./ExpeditionFleetChart.vue";
    import ExpeditionFleetTables from "./ExpeditionFleetTables.vue";

    @Component({
        components: {
            ExpeditionFleetChart,
            ExpeditionFleetTables,
            TabView,
        },
    })
    export default class ExpeditionFleet extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'chart',
                    title: this.$t('chart') as string,
                },
                {
                    name: 'tables',
                    title: this.$t('tables') as string,
                },
            ];
        }
    }
</script> 