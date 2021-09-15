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
    import { TabViewItem } from "../common/TabView.vue";
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
        },
    })
    export default class ExpeditionStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: this.$extension.$t.expoMenu.overview,
            },
            {
                name: 'resources',
                title: this.$extension.$t.expoMenu.resources,
            },
            {
                name: 'fleet',
                title: this.$extension.$t.expoMenu.fleet,
            },
            {
                name: 'darkMatter',
                title: this.$extension.$t.expoMenu.darkMatter,
            },
            {
                name: 'items',
                title: this.$extension.$t.expoMenu.items,
            },
            {
                name: 'distribution',
                title: this.$extension.$t.expoMenu.distribution,
            },
        ];
    }
</script>