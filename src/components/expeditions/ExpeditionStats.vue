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
                title: this.$t('extension.expoMenu.overview') as string,
            },
            {
                name: 'resources',
                title:  this.$t('extension.expoMenu.resources') as string,
            },
            {
                name: 'fleet',
                title:  this.$t('extension.expoMenu.fleet') as string,
            },
            {
                name: 'darkMatter',
                title:  this.$t('extension.expoMenu.darkMatter') as string,
            },
            {
                name: 'items',
                title:  this.$t('extension.expoMenu.items') as string,
            },
            {
                name: 'distribution',
                title:  this.$t('extension.expoMenu.distribution') as string,
            },
        ];
    }
</script>