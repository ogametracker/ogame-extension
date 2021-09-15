<template>
    <tab-view :items="items" overflow vertical>
        <template #players>
            <battles-overview-chart players />
        </template>
        <template #expos>
            <battles-overview-chart expeditions />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import BattlesOverviewChart from "./BattlesOverviewChart.vue";
    import { TabViewItem } from "@/components/common/TabView.vue";

    @Component({
        components: {
            BattlesOverviewChart,
        },
    })
    export default class BattlesOverview extends Vue {
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