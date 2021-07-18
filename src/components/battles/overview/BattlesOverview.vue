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
    import TabView, { TabViewItem } from "@/components/common/TabView.vue";
    import i18n from "@/i18n";

    @Component({
        components: {
            BattlesOverviewChart,
            TabView,
        },
    })
    export default class BattlesOverview extends Vue {
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