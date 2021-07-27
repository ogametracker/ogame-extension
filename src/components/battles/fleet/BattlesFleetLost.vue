<template>
    <tab-view :items="items" overflow vertical>
        <template #players>
            <battles-fleet-lost-chart players />
        </template>
        <template #expos>
            <battles-fleet-lost-chart expeditions />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import BattlesFleetLostChart from "./BattlesFleetLostChart.vue";
    import { TabViewItem } from "@/components/common/TabView.vue";
    import i18n from "@/i18n";

    @Component({
        components: {
            BattlesFleetLostChart,
        },
    })
    export default class BattlesFleetLost extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'players',
                    title: i18n.messages.extension.combats.againstPlayers,
                },
                {
                    name: 'expos',
                    title: i18n.messages.extension.combats.onExpeditions,
                },
            ];
        }
    }
</script> 