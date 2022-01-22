<template>
    <div style="height: 100%">
        TODO: scrollable item chart
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventResources } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { Localization } from '@/views/stats/i18n/Localization';
    import { startOfDay } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays';
    import addDays from 'date-fns/esm/addDays/index';
    import { Component, Vue } from 'vue-property-decorator';
    import { ScrollableChartDataset } from '../../common/ScrollableChart.vue';

    @Component({})
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ResourceType, string> = {
            [ResourceType.metal]: '#de5200',
            [ResourceType.crystal]: '#249df3',
            [ResourceType.deuterium]: '#14bf73',
        };

        private get datasets(): ScrollableChartDataset[] {
            const perDay = ExpeditionDataModule.expeditionsPerDay;
            const firstDay = ExpeditionDataModule.firstDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

            const resourceExposPerDay = days.map(
                day => (perDay[day] ?? []).filter(
                    expo => expo.type == ExpeditionEventType.resources
                ) as ExpeditionEventResources[]
            );

            return Object.values(ResourceType)
                .map(resource => ({
                    key: resource,
                    values: resourceExposPerDay.map(expos => expos.reduce((acc, expo) => acc + expo.resources[resource], 0)),
                    color: this.colors[resource],
                    label: 'LOCA: ' + resource, //LOCA
                }));
        }

        private formatX(x: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, x);

            return Localization.dateFormatter.format(day);
        }

        private getFooter(values: Record<ResourceType, number>): string[] {
            const {
                [ResourceType.metal]: metal,
                [ResourceType.crystal]: crystal,
                [ResourceType.deuterium]: deuterium
            } = values;

            const sum = metal + crystal + deuterium;
            const msu = metal + 2 * crystal + 3 * deuterium; //TODO: MSU from settings

            return [
                Localization.numberFormatter.format(sum) + ' LOCA: Total',//LOCA
                Localization.numberFormatter.format(msu) + ' LOCA: Total (MSU)',//LOCA
            ];
        }
    }
</script>