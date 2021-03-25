<template>
    <tab-view :items="items" vertical>
        <template #overview>
            <battles-overview />
        </template>
        <template #resources>
            <battles-resources />
        </template>
        <template #units>
            <battles-fleet />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "../common/TabView.vue";
    import BattlesOverview from "./overview/BattlesOverview.vue";
    import BattlesResources from "./resources/BattlesResources.vue";
    import BattlesFleet from "./fleet/BattlesFleet.vue";


    @Component({
        components: {
            BattlesOverview,
            BattlesResources,
            BattlesFleet,
            TabView,
        },
    })
    export default class BattleStats extends Vue {
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
        ];
    }
</script>