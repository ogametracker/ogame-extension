<template>
    <stats-chart
        :firstDay="firstDay"
        :itemsPerDay="exposPerDay"
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
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly color = '#075263';

        private get datasets(): StatsChartDataset<ExpeditionEventDarkMatter>[] {
            return [{
                key: 'dark-matter',
                label: `LOCA: dark-matter`, //LOCA
                color: this.color,
                filled: true,
                getValue: (expos: ExpeditionEventDarkMatter[]) => expos.reduce((acc, expo) => acc + expo.darkMatter, 0),
                showAverage: true,
            }];
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.darkMatter;
        }

        private get firstDay() {
            return ExpeditionDataModule.firstDay;
        }

        private get exposPerDay() {
            return ExpeditionDataModule.expeditionsPerDay;
        }
    }
</script>