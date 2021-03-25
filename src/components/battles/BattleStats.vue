<template>
    <tab-view :items="items" vertical>
        <template #overview>
            <battles-overview />
        </template>
        <template #resources>
            <battles-resources />
        </template>
        <template #fleet_players>
            <battles-fleet-players />
        </template>
        <template #fleet_expos>
            <battles-fleet-expos />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "../common/TabView.vue";
    import BattlesOverview from "./overview/BattlesOverview.vue";
    import BattlesResources from "./resources/BattlesResources.vue";
    import BattlesFleetPlayers from "./fleet/BattlesFleetPlayers.vue";
    import BattlesFleetExpos from "./fleet/BattlesFleetExpos.vue";


    @Component({
        components: {
            BattlesOverview,
            BattlesResources,
            BattlesFleetPlayers,
            BattlesFleetExpos,
            TabView,
        },
    })
    export default class BattleStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: 'Übersicht',
            },
            {
                name: 'resources',
                title: 'Rohstoffbilanz',
            },
            {
                name: 'fleet_players',
                title: 'Flottenbilanz (Spieler)',
            },
            {
                name: 'fleet_expos',
                title: 'Flottenbilanz (Expeditionen)',
            },
        ];
    }
</script>