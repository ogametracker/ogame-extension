<template>
    <stats-chart
        :datasets="datasets"
        :firstDay="firstDay"
        :itemsPerDay="reportsPerDay"
    >
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
    </stats-chart>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ResourceType } from '@/shared/models/v1/ogame/resources/ResourceType';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/v1/combat-reports/CombatReport';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {
        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get firstDay() {
            return CombatReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return CombatReportDataModule.reportsPerDay;
        }

        private get datasets(): StatsChartDataset<CombatReport>[] {
            return [
                ...Object.values(ResourceType).map(resource => ({
                    key: resource,
                    label: `LOCA: ${resource}`, //LOCA
                    color: this.colors[resource],
                    filled: true,
                    getValue: (reports: CombatReport[]) => reports.reduce((acc, report) => acc + report.loot[resource], 0),
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: 'LOCA: Total Units (MSU)',
                    color: this.colors.totalMsu,
                    filled: false,
                    getValue: reports => reports.reduce(
                        (acc, report) => acc
                            + report.loot.metal
                            + report.loot.crystal * this.msuConversionRates.crystal
                            + report.loot.deuterium * this.msuConversionRates.deuterium,
                        0
                    ),
                    stack: false,
                    showAverage: true,
                }
            ];
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
            const msu: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                ...this.msuConversionRates,
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