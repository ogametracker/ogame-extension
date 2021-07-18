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
    import TabView, { TabViewItem } from "../common/TabView.vue";
    import BattlesOverview from "./overview/BattlesOverview.vue";
    import BattlesResources from "./resources/BattlesResources.vue";
    import BattlesFleetLost from "./fleet/BattlesFleetLost.vue";
    import i18n from "@/i18n";


    @Component({
        components: {
            BattlesOverview,
            BattlesResources,
            BattlesFleetLost,
            TabView,
        },
    })
    export default class BattleStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: i18n.messages.extension.overview,
            },
            {
                name: 'resources',
                title: i18n.messages.extension.headers.resourcesOverview,
            },
            {
                name: 'fleet',
                title: i18n.messages.extension.combats.lostShips,
            },
        ];
    }
</script>