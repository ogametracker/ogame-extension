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
                                $i18n.$n(
                                    getResourcesAmount(
                                        getVisibleDatasets(datasets)
                                    )
                                )
                            "
                        />
                        <div v-text="$i18n.$t.common.resourceUnits" />

                        <div
                            class="number"
                            v-text="
                                $i18n.$n(
                                    getResourcesAmountInMsu(
                                        getVisibleDatasets(datasets)
                                    )
                                )
                            "
                        />
                        <div v-text="$i18n.$t.common.resourceUnitsMsu" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div
                        class="number"
                        v-text="$i18n.$n(getResourcesAmount(datasets))"
                    />
                    <div v-text="$i18n.$t.common.resourceUnits" />

                    <div
                        class="number"
                        v-text="$i18n.$n(getResourcesAmountInMsu(datasets))"
                    />
                    <div v-text="$i18n.$t.common.resourceUnitsMsu" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <msu-conversion-rate-settings />
            <hr class="two-column" />
            <expedition-ship-resource-units-factor-settings />
            <lost-ship-resource-units-factor-settings />
            <hr class="two-column" />
            <include-ships-found-on-expeditions-in-resource-balance-settings />
            <include-ships-lost-in-combats-in-resource-balance />
            <hr class="two-column" />
            <resource-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { CombatReportDataModule, DailyCombatReportResult } from '@/views/stats/data/CombatReportDataModule';
    import min from 'date-fns/min/index';
    import { DailyExpeditionResult, ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { DailyDebrisFieldReportResult, DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
    import IncludeShipsFoundOnExpeditionsInResourceBalanceSettings from '@/views/stats/components/settings/resource-balance/IncludeShipsFoundOnExpeditionsInResourceBalanceSettings.vue';
    import IncludeShipsLostInCombatsInResourceBalance from '@/views/stats/components/settings/resource-balance/IncludeShipsLostInCombatsInResourceBalance.vue';

    interface DayEvents {
        expeditions?: DailyExpeditionResult;
        combatReports?: DailyCombatReportResult;
        debrisFieldReports?: DailyDebrisFieldReportResult;
    }

    @Component({
        components: {
            StatsChart,
            ResourceColorSettings,
            MsuConversionRateSettings,
            ExpeditionShipResourceUnitsFactorSettings,
            LostShipResourceUnitsFactorSettings,
            IncludeShipsFoundOnExpeditionsInResourceBalanceSettings,
            IncludeShipsLostInCombatsInResourceBalance,
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

        private get includeFoundShips() {
            return SettingsDataModule.settings.resourceBalance.includeExpeditionFoundShipsResourceUnits;
        }

        private get includeLostShips() {
            return SettingsDataModule.settings.resourceBalance.includeLostShipsResourceUnits;
        }

        private get firstDay() {
            return min([
                ExpeditionDataModule.firstDay,
                CombatReportDataModule.firstDay,
                DebrisFieldReportDataModule.firstDay,
            ]);
        }

        private get eventsPerDay(): Record<number, DayEvents> {
            const result: Record<number, DayEvents> = {};

            Object.keys(ExpeditionDataModule.dailyResults).forEach(dayStr => {
                const day = parseInt(dayStr, 10);
                result[day] ??= {};
                result[day].expeditions = ExpeditionDataModule.dailyResults[day];
            });
            Object.keys(CombatReportDataModule.dailyResults).forEach(dayStr => {
                const day = parseInt(dayStr, 10);
                result[day] ??= {};
                result[day].combatReports = CombatReportDataModule.dailyResults[day];
            });
            Object.keys(DebrisFieldReportDataModule.dailyResults).forEach(dayStr => {
                const day = parseInt(dayStr, 10);
                result[day] ??= {};
                result[day].debrisFieldReports = DebrisFieldReportDataModule.dailyResults[day];
            });

            return result;
        }

        private get datasets(): StatsChartDataset<DayEvents>[] {
            return [
                ...ResourceTypes.map(resource => ({
                    key: resource,
                    label: this.$i18n.$t.resources[resource],
                    color: this.colors[resource],
                    filled: true,
                    getValue: (dayEvents: DayEvents) => this.getResource(dayEvents, resource),
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: this.$i18n.$t.common.resourceUnitsMsu,
                    color: this.colors.totalMsu,
                    filled: false,
                    getValue: dayEvents => this.getResource(dayEvents, ResourceType.metal)
                        + this.getResource(dayEvents, ResourceType.crystal) * this.msuConversionRates.crystal
                        + this.getResource(dayEvents, ResourceType.deuterium) * this.msuConversionRates.deuterium,
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

        private getResource(dayEvents: DayEvents, resource: ResourceType): number {
            return this.getExpeditionResourceAmount(dayEvents.expeditions, resource)
                + this.getCombatResourceAmount(dayEvents.combatReports, resource)
                + this.getDebrisFieldResourceAmount(dayEvents.debrisFieldReports, resource);
        }

        private getExpeditionResourceAmount(expeditions: DailyExpeditionResult | undefined, resource: ResourceType): number {
            if (expeditions == null) {
                return 0;
            }

            const includeFoundShipsFactor = this.includeFoundShips ? this.includeFoundShipsFactor[resource] : 0;
            const total = expeditions.findings.resources[resource]
                + expeditions.findings.fleetResourceUnits[resource] * includeFoundShipsFactor;

            return total;
        }

        private getCombatResourceAmount(dailyReports: DailyCombatReportResult | undefined, resource: ResourceType): number {
            if (dailyReports == null) {
                return 0;

            }
            const includeLostShipsFactor = this.includeLostShips ? this.includeLostShipsFactor[resource] : 0;

            const total = dailyReports.loot[resource]
                - (dailyReports.lostShips.onExpeditions.resourceUnits[resource]
                    + dailyReports.lostShips.againstPlayers.resourceUnits[resource]
                ) * includeLostShipsFactor;

            return total;
        }

        private getDebrisFieldResourceAmount(reports: DailyDebrisFieldReportResult | undefined, resource: ResourceType): number {
            if (reports == null) {
                return 0;
            }

            if (resource == ResourceType.deuterium) {
                return 0;
            }

            return reports[resource];
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

    .floating-settings::v-deep .floating-menu {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 8px;

        .two-column {
            grid-column: 1 / span 2;
        }

        hr {
            width: 100%;
        }
    }
</style>