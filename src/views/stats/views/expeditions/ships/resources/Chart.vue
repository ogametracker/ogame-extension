<template>
    <scrollable-chart
        :datasets="datasets"
        :x-label-formatter="(x) => formatX(x)"
        no-legend
    />
</template>

<script lang="ts">
    import { ExpeditionEventDarkMatter, ExpeditionEventResources } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { Localization } from '@/views/stats/i18n/Localization';
    import { startOfDay } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays';
    import addDays from 'date-fns/esm/addDays/index';
    import { Component, Vue } from 'vue-property-decorator';
    import { ScrollableChartDataset } from '@stats/components/common/ScrollableChart.vue';

    @Component({})
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly color = '#075263';

        private get datasets(): ScrollableChartDataset[] {
            const perDay = ExpeditionDataModule.expeditionsPerDay;
            const firstDay = ExpeditionDataModule.firstDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

            const dmExposPerDay = days.map(
                day => (perDay[day] ?? []).filter(
                    expo => expo.type == ExpeditionEventType.darkMatter
                ) as ExpeditionEventDarkMatter[]
            );

            return [{
                key: 'dark-matter',
                values: dmExposPerDay.map(expos => expos.reduce((acc, expo) => acc + expo.darkMatter, 0)),
                color: this.color,
                label: 'LOCA: Dark Matter', //LOCA
                filled: true,
                    hidePoints: false,
                    stack: true,
            }];
        }

        private formatX(x: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, x);

            return this.$date(day);
        }
    }
</script>