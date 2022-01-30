<template>
    <expedition-chart
        :filter="(expo) => filterExpo(expo)"
        :datasets="datasets"
        stacked
        show-average
        no-legend
    />
</template>

<script lang="ts">
    import { ExpeditionEvent, ExpeditionEventDarkMatter } from '@/shared/models/v1/expeditions/ExpeditionEvents';
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
        private readonly color = '#075263';

        private get datasets(): ExpeditionDataset[] {
            return [{
                key: 'dark-matter',
                label: `LOCA: dark-matter`, //LOCA
                color: this.color,
                filled: true,
                getValue: expos => (expos as ExpeditionEventDarkMatter[])
                    .reduce((acc, expo) => acc + expo.darkMatter, 0),
            }];
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.darkMatter;
        }
    }
</script>