<template>
    <div class="chart-container">
        <stats-chart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="eventsPerDay">
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="$i18n.$n(getResourcesAmount(getVisibleDatasets(datasets)))" />
                        <div v-text="$i18n.$t.extension.common.resourceUnits" />

                        <div class="number" v-text="$i18n.$n(getConvertedResourcesAmount(getVisibleDatasets(datasets)))" />
                        <div v-text="`${$i18n.$t.extension.common.resourceUnits} (${conversionModeText})`" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$i18n.$n(getResourcesAmount(datasets))" />
                    <div v-text="$i18n.$t.extension.common.resourceUnits" />

                    <div class="number" v-text="$i18n.$n(getConvertedResourcesAmount(datasets))" />
                    <div v-text="`${$i18n.$t.extension.common.resourceUnits} (${conversionModeText})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <expedition-ship-resource-units-factor-settings />
            <lost-ship-resource-units-factor-settings />
            <hr class="two-column" />
            <include-ships-found-on-expeditions-in-resource-balance-settings />
            <include-ships-lost-in-combats-in-resource-balance />
            <IncludeLostLootResourcesInResourceBalance />
            <hr class="two-column" />
            <conversion-rate-settings />
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
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
    import IncludeShipsFoundOnExpeditionsInResourceBalanceSettings from '@/views/stats/components/settings/resource-balance/IncludeShipsFoundOnExpeditionsInResourceBalanceSettings.vue';
    import IncludeShipsLostInCombatsInResourceBalance from '@/views/stats/components/settings/resource-balance/IncludeShipsLostInCombatsInResourceBalance.vue';
    import IncludeLostLootResourcesInResourceBalance from '@/views/stats/components/settings/resource-balance/IncludeLostLootResourcesInResourceBalance.vue';
    import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';

    interface DayEvents {
        expeditions?: DailyExpeditionResult;
        combatReports?: DailyCombatReportResult;
        debrisFieldReports?: DailyDebrisFieldReportResult;
    }

    @Component({
        components: {
            StatsChart,
            ResourceColorSettings,
            ConversionRateSettings,
            ExpeditionShipResourceUnitsFactorSettings,
            LostShipResourceUnitsFactorSettings,
            IncludeShipsFoundOnExpeditionsInResourceBalanceSettings,
            IncludeShipsLostInCombatsInResourceBalance,
            IncludeLostLootResourcesInResourceBalance,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get includeFoundShipsFactor(): Record<ResourceType, number> {
            const { factor, deuteriumFactor } = SettingsDataModule.settings.expeditionFoundShipsResourceUnits;
            const settingFactor = this.includeFoundShips ? 1 : 0;

            return {
                [ResourceType.metal]: factor * settingFactor,
                [ResourceType.crystal]: factor * settingFactor,
                [ResourceType.deuterium]: deuteriumFactor * settingFactor,
            };
        }

        private get includeLostShipsFactor(): Record<ResourceType, number> {
            const { factor, deuteriumFactor } = SettingsDataModule.settings.lostShipsResourceUnits;
            const settingFactor = this.includeLostShips ? 1 : 0;

            return {
                [ResourceType.metal]: factor * settingFactor,
                [ResourceType.crystal]: factor * settingFactor,
                [ResourceType.deuterium]: deuteriumFactor * settingFactor,
            };
        }

        private get includeFoundShips() {
            return SettingsDataModule.settings.resourceBalance.includeExpeditionFoundShipsResourceUnits;
        }

        private get includeLostShips() {
            return SettingsDataModule.settings.resourceBalance.includeLostShipsResourceUnits;
        }

        private get includeLostLoot() {
            return SettingsDataModule.settings.resourceBalance.includeLostLootResources;
        }

        private get conversionModeText() {
            return SettingsDataModule.settings.conversionRates.mode == 'msu'
                ? this.$i18n.$t.extension.common.msu
                : this.$i18n.$t.extension.common.dsu;
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
                    label: this.$i18n.$t.extension.resources[resource],
                    color: this.colors[resource],
                    filled: true,
                    getValue: (dayEvents: DayEvents) => this.getResource(dayEvents, resource),
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: `${this.$i18n.$t.extension.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.extension.common.msu : this.$i18n.$t.extension.common.dsu})`,
                    color: this.colors.totalConverted,
                    filled: false,
                    getValue: dayEvents => getMsuOrDsu({
                        metal: this.getResource(dayEvents, ResourceType.metal),
                        crystal: this.getResource(dayEvents, ResourceType.crystal),
                        deuterium: this.getResource(dayEvents, ResourceType.deuterium),
                    }),
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

        private getConvertedResourcesAmount(datasets: ScollableChartFooterDataset[]): number {
            return datasets.reduce((acc, cur) => {
                if (!(ResourceTypes as (string | number)[]).includes(cur.key)) {
                    return acc;
                }
                return acc + getMsuOrDsu({ [cur.key as ResourceType]: cur.value });
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

            const includeFoundShipsFactor = this.includeFoundShipsFactor[resource];
            const total = expeditions.findings.resources[resource]
                + expeditions.findings.fleetResourceUnits[resource] * includeFoundShipsFactor;

            return total;
        }

        private getCombatResourceAmount(dailyReports: DailyCombatReportResult | undefined, resource: ResourceType): number {
            if (dailyReports == null) {
                return 0;
            }

            const lostLootFactor = this.includeLostLoot ? 1 : 0;
            const lootResources = dailyReports.loot.lost[resource] * lostLootFactor
                + dailyReports.loot.gained[resource];

            const includeLostShipsFactor = this.includeLostShipsFactor[resource];
            const lostShipResourceUnits = (
                dailyReports.lostShips.onExpeditions.resourceUnits[resource]
                + dailyReports.lostShips.againstPlayers.resourceUnits[resource]
            ) * includeLostShipsFactor;

            const total = lootResources - lostShipResourceUnits;

            return total;
        }

        private getDebrisFieldResourceAmount(reports: DailyDebrisFieldReportResult | undefined, resource: ResourceType): number {
            if (reports == null) {
                return 0;
            }

            if (resource == ResourceType.deuterium) {
                return 0;
            }

            return reports.total[resource];
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