<template>
    <expedition-chart
        :filter="(expo) => filterExpo(expo)"
        :datasets="datasets"
        stacked
        show-average
    />
</template>

<script lang="ts">
    import { ExpeditionEvent } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionChart, { ExpeditionDataset } from '@stats/components/expeditions/ExpeditionChart.vue';

    @Component({
        components: {
            ExpeditionChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
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

        private get datasets(): ExpeditionDataset[] {
            return Object.values(ExpeditionEventType).map(type => ({
                    key: type,
                    label: `LOCA: ${type}`, //LOCA
                    color: this.colors[type],
                    filled: true,
                    getValue: (expos: ExpeditionEvent[]) => expos.filter(e => e.type == type).length,
                }));
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return true;
        }
    }
</script>