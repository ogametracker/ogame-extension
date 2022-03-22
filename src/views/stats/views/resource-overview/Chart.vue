<template>
    <div class="chart-container">
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
                                    getResourcesAmount(
                                        getVisibleDatasets(datasets)
                                    )
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

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <msu-conversion-rate-settings />
            <hr />
            <expedition-ship-resource-units-factor-settings />
            <hr />
            <lost-ship-resource-units-factor-settings />
            <hr />
            <resource-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
    import min from 'date-fns/min/index';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { ExpeditionEvent, ExpeditionFindableShipType } from '@/shared/models/expeditions/ExpeditionEvents';
    import { DebrisFieldReport } from '@/shared/models/debris-field-reports/DebrisFieldReport';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { Ships } from '@/shared/models/ogame/ships/Ships';
    import { addCost, Cost, multiplyCost, multiplyCostComponentWise, subCost } from '@/shared/models/ogame/common/Cost';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';

    interface DayEvents {
        expeditions: ExpeditionEvent[];
        combatReports: CombatReport[];
        debrisFieldReports: DebrisFieldReport[];
    }

    @Component({
        components: {
            StatsChart,
            ResourceColorSettings,
            MsuConversionRateSettings,
            ExpeditionShipResourceUnitsFactorSettings,
            LostShipResourceUnitsFactorSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get includeFoundShipsFactor(): Record<ResourceType, number> {
            const { factor, deuteriumFactor } = SettingsDataModule.settings.expeditionFoundShipsResourceUnits;
            return {
                [ResourceType.metal]: factor,
                [ResourceType.crystal]: factor,
                [ResourceType.deuterium]: deuteriumFactor,
            };
        }

        private get includeLostShipsFactor(): Record<ResourceType, number> {
            const { factor, deuteriumFactor } = SettingsDataModule.settings.lostShipsResourceUnits;
            return {
                [ResourceType.metal]: factor,
                [ResourceType.crystal]: factor,
                [ResourceType.deuterium]: deuteriumFactor,
            };
        }

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
            const msu: Record<ResourceType, number> = {
                [ResourceType.metal]: 1,
                ...this.msuConversionRates,
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
                            + events.combatReports.reduce((acc, combat) => acc + this.getCombatResourceAmount(combat)[resource], 0)
                            + events.debrisFieldReports.reduce((acc, report) => acc + (resource == ResourceType.deuterium ? 0 : report[resource]), 0),
                        0
                    ),
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: 'LOCA: Total Units (MSU)',
                    color: this.colors.totalMsu,
                    filled: false,
                    getValue: (dayEvents: DayEvents[]) => Object.values(ResourceType).reduce(
                        (acc, resource) => acc + dayEvents.reduce(
                            (acc, events) => acc
                                + msu[resource] * (
                                    events.expeditions.reduce((acc, expo) => acc + this.getResourceAmount(expo, resource), 0)
                                    + events.combatReports.reduce((acc, combat) => acc + this.getCombatResourceAmount(combat)[resource], 0)
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

        private getResourceAmount(expo: ExpeditionEvent, resource: ResourceType) {
            const includeFoundShipsFactor = this.includeFoundShipsFactor;

            switch (expo.type) {
                case ExpeditionEventType.resources: {
                    return expo.resources[resource];
                }

                case ExpeditionEventType.fleet: {
                    return getNumericEnumValues<ShipType>(ExpeditionFindableShipType).reduce(
                        (acc, ship) => acc + multiplyCost(Ships[ship].getCost(), expo.fleet[ship] ?? 0)[resource] * includeFoundShipsFactor[resource],
                        0
                    );
                }

                default: return 0;
            }
        }

        private getCombatResourceAmount(combatReport: CombatReport) {
            const includeLostShipsFactor = this.includeLostShipsFactor;
            const loot: Cost = {
                ...combatReport.loot,
                energy: 0,
            };
            const lostShipsUnits = getNumericEnumValues<ShipType>(ShipType).reduce(
                (acc, ship) => addCost(acc, multiplyCost(Ships[ship].getCost(), combatReport.lostShips[ship] ?? 0)),
                { metal: 0, crystal: 0, deuterium: 0, energy: 0 } as Cost
            );

            return subCost(loot, multiplyCostComponentWise(lostShipsUnits, { ...includeLostShipsFactor, energy: 0 }));
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

    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>