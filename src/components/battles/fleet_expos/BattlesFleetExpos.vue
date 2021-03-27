<template>
    <tab-view :items="items" overflow vertical>
        <template #chart>
            <battles-fleet-expos-destroyed-chart />
        </template>
        <template #tables>
            <battles-fleet-expos-lost-chart />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import TabView, { TabViewItem } from '@/components/common/TabView.vue';
    import i18n from '@/i18n';
    import { Component, Vue } from 'vue-property-decorator';
    import BattlesFleetExposDestroyedChart from './BattlesFleetExposDestroyedChart.vue';
    import BattlesFleetExposLostChart from './BattlesFleetExposLostChart.vue';

    @Component({
        components: {
            TabView,
            BattlesFleetExposDestroyedChart,
            BattlesFleetExposLostChart,
        }
    })
    export default class BattlesFleetExpos extends Vue {
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