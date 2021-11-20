<template>
    <tab-view :items="items" vertical>
        <template #overview>
            <battles-overview />
        </template>
        <template #resources>
            <battles-resources />
        </template>
        <template #fleet>
            <battles-fleet-lost />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { TabViewItem } from "@/components/common/TabView.vue";
    import BattlesOverview from "./overview/BattlesOverview.vue";
    import BattlesResources from "./resources/BattlesResources.vue";
    import BattlesFleetLost from "./fleet/BattlesFleetLost.vue";


    @Component({
        components: {
            BattlesOverview,
            BattlesResources,
            BattlesFleetLost,
        },
    })
    export default class BattleStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: this.$i18n.$t.overview,
            },
            {
                name: 'resources',
                title: this.$i18n.$t.headers.resourcesOverview,
            },
            {
                name: 'fleet',
                title: this.$i18n.$t.combats.lostShips,
            },
        ];
    }
</script>