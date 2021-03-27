<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <battles-fleet-players-destroyed-chart />
        </template>
        <template #tables>
            <battles-fleet-players-lost-chart />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import TabView, { TabViewItem } from '@/components/common/TabView.vue';
    import i18n from '@/i18n';
    import { Component, Vue } from 'vue-property-decorator';
    import BattlesFleetPlayersDestroyedChart from './BattlesFleetPlayersDestroyedChart.vue';
    import BattlesFleetPlayersLostChart from './BattlesFleetPlayersLostChart.vue';

    @Component({
        components: {
            TabView,
            BattlesFleetPlayersDestroyedChart,
            BattlesFleetPlayersLostChart,
        }
    })
    export default class BattlesFleetPlayers extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'destroyed',
                    title: i18n.messages.extension.destroyed,
                },
                {
                    name: 'lost',
                    title: i18n.messages.extension.lost,
                },
            ];
        }
    }
</script>