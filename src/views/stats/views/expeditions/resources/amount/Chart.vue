<template>
    <expedition-chart :filter="(expo) => filterExpo(expo)" :datasets="datasets">
        <template #tooltip-footer="{ datasets }">
            <template
                v-if="getVisibleDatasets(datasets).length < datasets.length"
            >
                <div class="footer-item">
                    <div
                        class="number"
                        v-text="
                            $number(
                                getResourcesAmount(getVisibleDatasets(datasets))
                            )
                        "
                    />
                    <div>LOCA: Resources</div>

                    <div
                        class="number"
                        v-text="
                            $number(
                                getResourcesAmountInMsu(
                                    getVisibleDatasets(datasets)
                                )
                            )
                        "
                    />
                    <div>LOCA: Resources (MSU)</div>
                </div>
                <hr />
            </template>

            <div class="footer-item">
                <div
                    class="number"
                    v-text="$number(getResourcesAmount(datasets))"
                />
                <div>LOCA: Resources (Total)</div>

                <div
                    class="number"
                    v-text="$number(getResourcesAmountInMsu(datasets))"
                />
                <div>LOCA: Resources (Total, MSU)</div>
            </div>
        </template>
    </expedition-chart>
</template>

<script lang="ts">
    import { ExpeditionEvent, ExpeditionEventResources } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionChart, { ExpeditionDataset } from '@stats/components/expeditions/ExpeditionChart.vue';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';

    @Component({
        components: {
            ExpeditionChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ResourceType, string> = {
            [ResourceType.metal]: '#de5200',
            [ResourceType.crystal]: '#249df3',
            [ResourceType.deuterium]: '#14bf73',
        };

        private get datasets(): ExpeditionDataset[] {
            return [
                ...Object.values(ResourceType).map(resource => ({
                    key: resource,
                    label: `LOCA: ${resource}`, //LOCA
                    color: this.colors[resource],
                    filled: true,
                    getValue: (expos: ExpeditionEvent[]) => (expos as ExpeditionEventResources[])
                        .reduce((acc, expo) => acc + expo.resources[resource], 0),
                })),
                {
                    key: 'total',
                    label: 'LOCA: Total Units (MSU)',
                    color: '#999999',
                    filled: false,
                    getValue: expos => (expos as ExpeditionEventResources[])
                        .reduce(
                            (acc, expo) => acc + expo.resources.metal + expo.resources.crystal * 2 + expo.resources.deuterium * 3 //TODO: MSU from settings
                            , 0),
                    stack: false,
                }
            ];
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.resources;
        }

        private getVisibleDatasets(datasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
            return datasets.filter(d => d.visible);
        }

        private getResourcesAmount(datasets: ScollableChartFooterDataset[]): number {
            const resources: string[] = [ResourceType.metal, ResourceType.crystal, ResourceType.deuterium];
            return datasets
                .filter(d => resources.includes(d.key.toString()))
                .reduce((acc, cur) => acc + cur.value, 0);
        }

        private getResourcesAmountInMsu(datasets: ScollableChartFooterDataset[]): number {
            //TODO: MSU from setings
            const msu: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                [ResourceType.crystal]: 2,
                [ResourceType.deuterium]: 3,
            };
            return datasets.reduce((acc, cur) => {
                if (!(cur.key in msu)) {
                    return acc;
                }
                return acc + cur.value * msu[cur.key as ResourceType];
            }, 0);
        }
    }
</script>
<style lang="scss" scoped>
    .footer-item {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 4px;

        .number {
            text-align: right;
        }
    }
</style>