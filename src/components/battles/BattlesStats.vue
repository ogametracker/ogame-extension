<template>
    <tab-view :items="items" vertical>
        <template #overview>
            <battles-overview />
        </template>
        <template #resources>
            <battles-resources />
        </template>
        <template #fleet_players>
            <battles-fleet-players-lost-chart />
        </template>
        <template #fleet_expos>
            <battles-fleet-expos-lost-chart />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "../common/TabView.vue";
    import BattlesOverview from "./overview/BattlesOverview.vue";
    import BattlesResources from "./resources/BattlesResources.vue";
    import BattlesFleetPlayersLostChart from "./fleet_players/BattlesFleetPlayersLostChart.vue";
    import BattlesFleetExposLostChart from "./fleet_expos/BattlesFleetExposLostChart.vue";


    @Component({
        components: {
            BattlesOverview,
            BattlesResources,
            BattlesFleetPlayersLostChart,
            BattlesFleetExposLostChart,
            TabView,
        },
    })
    export default class BattleStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: 'Übersicht', //TODO: localization
            },
            {
                name: 'resources',
                title: 'Rohstoffbilanz', //TODO: localization
            },
            {
                name: 'fleet_players',
                title: 'Verloren gegen Spieler', //TODO: localization
            },
            {
                name: 'fleet_expos',
                title: 'Verloren auf Expeditionen', //TODO: localization
            },
        ];
    }
</script>