<template>
    <tab-view :items="items" overflow vertical-content>
        <template #chart>
            <expedition-dark-matter-chart />
        </template>
        <template #tables>
            <expedition-dark-matter-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import TabView, { TabViewItem } from "@/components/common/TabView.vue";
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionDarkMatterChart from "./ExpeditionDarkMatterChart.vue";
    import ExpeditionDarkMatterTables from "./ExpeditionDarkMatterTables.vue";

    @Component({
        components: {
            ExpeditionDarkMatterChart,
            ExpeditionDarkMatterTables,
            TabView,
        },
    })
    export default class ExpeditionDarkMatter extends Vue {
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