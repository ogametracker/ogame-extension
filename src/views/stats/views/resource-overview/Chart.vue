<template>
    <stats-chart
        :datasets="datasets"
        :firstDay="firstDay"
        :itemsPerDay="eventsPerDay"
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
    import min from 'date-fns/min/index';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { ExpeditionEvent, ExpeditionFindableShipType } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { DebrisFieldReport } from '@/shared/models/v1/debris-field-reports/DebrisFieldReport';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { getResources } from '../expeditions/ships/resources/getResources';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';

    interface DayEvents {
        expeditions: ExpeditionEvent[];
        combatReports: CombatReport[];
        debrisFieldReports: DebrisFieldReport[];
    }

    @Component({
        components: {
            StatsChart,
        },
    })
    export default class Charts extends Vue {
        //TODO: colors from settings
        private readonly colors: Record<ResourceType, string> = {
            [ResourceType.metal]: '#de5200',
            [ResourceType.crystal]: '#249df3',
            [ResourceType.deuterium]: '#14bf73',
        };

        private get firstDay() {
            return min([
                ExpeditionDataModule.firstDay,
                CombatReportDataModule.firstDay,
                DebrisFieldReportDataModule.firstDay,
            ]);
        }

        private get eventsPerDay(): Record<number, DayEvents[]> {
            const result: Record<number, [DayEvents]> = {};

            Object.keys(ExpeditionDataModule.expeditionsPerDay).forEach(dayStr => {
                const day = parseInt(dayStr, 10);
                result[day] ??= [{
                    expeditions: [],
                    combatReports: [],
                    debrisFieldReports: [],
                }];
                result[day][0].expeditions.push(...ExpeditionDataModule.expeditionsPerDay[day]);
            });
            Object.keys(CombatReportDataModule.reportsPerDay).forEach(dayStr => {
                const day = parseInt(dayStr, 10);
                result[day] ??= [{
                    expeditions: [],
                    combatReports: [],
                    debrisFieldReports: [],
                }];
                result[day][0].combatReports.push(...CombatReportDataModule.reportsPerDay[day]);
            });
            Object.keys(DebrisFieldReportDataModule.reportsPerDay).forEach(dayStr => {
                const day = parseInt(dayStr, 10);
                result[day] ??= [{
                    expeditions: [],
                    combatReports: [],
                    debrisFieldReports: [],
                }];
                result[day][0].debrisFieldReports.push(...DebrisFieldReportDataModule.reportsPerDay[day]);
            });

            return result;
        }

        private get datasets(): StatsChartDataset<DayEvents>[] {
            //TODO: MSU from setings
            const msu: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                [ResourceType.crystal]: 2,
                [ResourceType.deuterium]: 3,
            };

            return [
                ...Object.values(ResourceType).map(resource => ({
                    key: resource,
                    label: `LOCA: ${resource}`, //LOCA
                    color: this.colors[resource],
                    filled: true,
                    getValue: (dayEvents: DayEvents[]) => dayEvents.reduce(
                        (acc, events) => acc
                            + events.expeditions.reduce((acc, expo) => acc + this.getResourceAmount(expo, resource), 0)
                            + events.combatReports.reduce((acc, combat) => acc + combat.loot[resource], 0)
                            + events.debrisFieldReports.reduce((acc, report) => acc + (resource == ResourceType.deuterium ? 0 : report[resource]), 0),
                        0
                    ),
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: 'LOCA: Total Units (MSU)',
                    color: '#999999',
                    filled: false,
                    getValue: (dayEvents: DayEvents[]) => Object.values(ResourceType).reduce(
                        (acc, resource) => acc + dayEvents.reduce(
                            (acc, events) => acc
                                + msu[resource] * (
                                    events.expeditions.reduce((acc, expo) => acc + this.getResourceAmount(expo, resource), 0)
                                    + events.combatReports.reduce((acc, combat) => acc + combat.loot[resource], 0)
                                    + events.debrisFieldReports.reduce((acc, report) => acc + (resource == ResourceType.deuterium ? 0 : report[resource]), 0)
                                ),
                            0
                        ),
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

        private getResourceAmount(expo: ExpeditionEvent, resource: ResourceType) {
            const includeFoundShipsFactor: number = 0.35; //TODO: factor from settings

            switch (expo.type) {
                case ExpeditionEventType.resources: {
                    return expo.resources[resource];
                }

                case ExpeditionEventType.fleet: {
                    if (includeFoundShipsFactor == 0) {
                        return 0;
                    }

                    return includeFoundShipsFactor * getNumericEnumValues(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + getResources(ship, expo.fleet[ship] ?? 0)[resource],
                        0
                    );
                }

                default: return 0;
            }
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