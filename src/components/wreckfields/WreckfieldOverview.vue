<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <wreckfield-overview-chart />
        </template>
        <template #tables>
            <wreckfield-overview-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "@/components/common/TabView.vue";
    import WreckfieldOverviewChart from "./WreckfieldOverviewChart.vue";
    import WreckfieldOverviewTables from "./WreckfieldOverviewTables.vue";
    import i18n from "@/i18n";

    @Component({
        components: {
            WreckfieldOverviewChart,
            WreckfieldOverviewTables,
            TabView,
        },
    })
    export default class WreckfieldOverview extends Vue {
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