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