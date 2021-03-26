<template>
    <tab-view :items="items" vertical>
        <template #overview>
            <expedition-overview />
        </template>
        <template #resources>
            <expedition-resources />
        </template>
        <template #fleet>
            <expedition-fleet />
        </template>
        <template #darkMatter>
            <expedition-dark-matter />
        </template>
        <template #items>
            <expedition-item-chart />
        </template>
        <template #distribution>
            <expedition-type-distribution-chart />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "../common/TabView.vue";
    import ExpeditionOverview from "./overview/ExpeditionOverview.vue";
    import ExpeditionResources from "./resources/ExpeditionResources.vue";
    import ExpeditionFleet from "./fleet/ExpeditionFleet.vue";
    import ExpeditionDarkMatter from "./darkMatter/ExpeditionDarkMatter.vue";
    import ExpeditionItemChart from './item/ExpeditionItemChart.vue';
    import ExpeditionTypeDistributionChart from './distribution/ExpeditionTypeDistributionChart.vue';
    import i18n from "@/i18n";


    @Component({
        components: {
            ExpeditionOverview,
            ExpeditionResources,
            ExpeditionFleet,
            ExpeditionDarkMatter,
            ExpeditionItemChart,
            ExpeditionTypeDistributionChart,
            TabView,
        },
    })
    export default class ExpeditionStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: i18n.messages.extension.expoMenu.overview,
            },
            {
                name: 'resources',
                title: i18n.messages.extension.expoMenu.resources,
            },
            {
                name: 'fleet',
                title: i18n.messages.extension.expoMenu.fleet,
            },
            {
                name: 'darkMatter',
                title: i18n.messages.extension.expoMenu.darkMatter,
            },
            {
                name: 'items',
                title: i18n.messages.extension.expoMenu.items,
            },
            {
                name: 'distribution',
                title: i18n.messages.extension.expoMenu.distribution,
            },
        ];
    }
</script>