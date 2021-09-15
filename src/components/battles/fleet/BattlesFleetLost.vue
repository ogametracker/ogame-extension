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
                    title: this.$i18n.$t.combats.againstPlayers,
                },
                {
                    name: 'expos',
                    title: this.$i18n.$t.combats.onExpeditions,
                },
            ];
        }
    }
</script> 