<template>
    <tab-view :items="items">
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
            <expedition-item-table />
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
    import ExpeditionItemTable from './item/ExpeditionItemTable.vue';
    import ExpeditionTypeDistributionChart from './distribution/ExpeditionTypeDistributionChart.vue';


    @Component({
        components: {
            ExpeditionOverview,
            ExpeditionResources,
            ExpeditionFleet,
            ExpeditionDarkMatter,
            ExpeditionItemTable,
            ExpeditionTypeDistributionChart,
            TabView,
        },
    })
    export default class ExpeditionStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: 'Übersicht',
            },
            {
                name: 'resources',
                title: 'Rohstofffunde',
            },
            {
                name: 'fleet',
                title: 'Flottenfunde',
            },
            {
                name: 'darkMatter',
                title: 'DM-Funde',
            },
            {
                name: 'items',
                title: 'Itemfunde',
            },
            {
                name: 'distribution',
                title: 'Verteilung in %',
            },
        ];
    }
</script>