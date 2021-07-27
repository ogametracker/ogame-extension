<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <expedition-dark-matter-chart />
        </template>
        <template #tables>
            <expedition-dark-matter-tables />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { TabViewItem } from "@/components/common/TabView.vue";
    import i18n from "@/i18n";
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionDarkMatterChart from "./ExpeditionDarkMatterChart.vue";
    import ExpeditionDarkMatterTables from "./ExpeditionDarkMatterTables.vue";

    @Component({
        components: {
            ExpeditionDarkMatterChart,
            ExpeditionDarkMatterTables,
        },
    })
    export default class ExpeditionDarkMatter extends Vue {
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