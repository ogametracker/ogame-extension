<template>
    <expedition-chart
        :filter="(expo) => filterExpo(expo)"
        :datasets="datasets"
        stacked
        show-average
    />
</template>

<script lang="ts">
    import { ExpeditionEvent, ExpeditionEventFleet } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionChart, { ExpeditionDataset } from '@stats/components/expeditions/ExpeditionChart.vue';
    import { ExpeditionEventSize } from '@/shared/models/v1/expeditions/ExpeditionEventSize';

    @Component({
        components: {
            ExpeditionChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ExpeditionEventSize, string> = {
            [ExpeditionEventSize.small]: '#90A4AE',
            [ExpeditionEventSize.medium]: '#3949AB',
            [ExpeditionEventSize.large]: '#F50057',
        };

        private get datasets(): ExpeditionDataset[] {
            return Object.values(ExpeditionEventSize).map(size => ({
                key: size,
                label: `LOCA: ${size}`, //LOCA
                color: this.colors[size],
                filled: true,
                getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventFleet[]).filter(e => e.size == size).length,
            }));
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.fleet;
        }
    }
</script>