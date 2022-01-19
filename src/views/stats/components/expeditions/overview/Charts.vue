<template>
    <div style="height: 100%">
        <scrollable-chart :datasets="datasets" />
        TODO: Diagramm Übersicht Expeditionen
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import { ScrollableChartDataset } from '../../common/ScrollableChart.vue';

    @Component({})
    export default class Charts extends Vue {
        private readonly colors: Record<ExpeditionEventType, string> = {
            [ExpeditionEventType.nothing]: '#2472f3',
            [ExpeditionEventType.resources]: '#c72525',
            [ExpeditionEventType.fleet]: '#fbbc04',
            [ExpeditionEventType.delay]: '#9ecc00',
            [ExpeditionEventType.early]: '#00a95e',
            [ExpeditionEventType.darkMatter]: '#075263',
            [ExpeditionEventType.pirates]: '#de5200',
            [ExpeditionEventType.aliens]: '#16a8d4',
            [ExpeditionEventType.item]: '#ad135e',
            [ExpeditionEventType.trader]: '#888888',
            [ExpeditionEventType.lostFleet]: '#ffffff',
        };

        private get datasets(): ScrollableChartDataset[] {
            return Object.values(ExpeditionEventType)
                .map(type => ({
                    key: type,
                    points: Array.from({ length: 30 }).map((_, x) => ({ x, y: Math.trunc(Math.random() * 100) })),
                    color: this.colors[type],
                    label: type,
                }));
        }
    }
</script>