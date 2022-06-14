<template>
    <div class="chart-container">
        <stats-chart
            :datasets="datasets"
            :filter="(combat) => filterCombat(combat)"
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
                                $number(getSum(getVisibleDatasets(datasets)))
                            "
                        />
                        <div v-text="this.$i18n.$t.resources.sumMsu" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$number(getSum(datasets))" />
                    <div v-text="this.$i18n.$t.resources.sumMsu" />
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
            <lost-ship-resource-units-factor-settings />
            <hr />
            <ship-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/ScrollableChart.vue';
    import { CombatReportDataModule } from '@/views/stats/data/CombatReportDataModule';
    import { CombatReport } from '@/shared/models/combat-reports/CombatReport';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { getNumericEnumValues } from '@/shared/utils/getNumericEnumValues';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import ShipColorSettings from '@stats/components/settings/colors/ShipColorSettings.vue';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { multiplyCost } from '@/shared/models/ogame/common/Cost';
    import { Ships } from '@/shared/models/ogame/ships/Ships';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';

    @Component({
        components: {
            StatsChart,
            ShipColorSettings,
            MsuConversionRateSettings,
            LostShipResourceUnitsFactorSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get factors() {
            return SettingsDataModule.settings.lostShipsResourceUnits;
        }

        private filterCombat(combat: CombatReport): boolean {
            return combat.isExpedition;
        }

        private get firstDay() {
            return CombatReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return CombatReportDataModule.reportsPerDay;
        }

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get datasets(): StatsChartDataset<CombatReport>[] {
            const factors: Record<ResourceType, number> = {
                [ResourceType.metal]: this.factors.factor,
                [ResourceType.crystal]: this.factors.factor,
                [ResourceType.deuterium]: this.factors.deuteriumFactor,
            };

            return [
                ...Object.values(ResourceType).map(resource => ({
                    key: resource,
                    label: this.$i18n.$t.resources[resource],
                    color: this.colors[resource],
                    filled: true,
                    getValue: (reports: CombatReport[]) => reports.reduce(
                        (acc, report) => acc + getNumericEnumValues<ShipType>(ShipType).reduce(
                            (acc, ship) => acc + multiplyCost(Ships[ship].getCost(), report.lostShips[ship] ?? 0)[resource] * factors[resource],
                            0
                        ),
                        0
                    ),
                })),
                {
                    key: 'total',
                    label: this.$i18n.$t.resources.sumMsu,
                    color: this.colors.totalMsu,
                    filled: false,
                    getValue: (reports: CombatReport[]) => reports.reduce(
                        (acc, report) => acc + getNumericEnumValues<ShipType>(ShipType).reduce(
                            (acc, ship) => {
                                const res = multiplyCost(Ships[ship].getCost(), report.lostShips[ship] ?? 0);
                                return acc
                                    + res.metal * factors.metal
                                    + res.crystal * this.msuConversionRates.crystal * factors.crystal
                                    + res.deuterium * this.msuConversionRates.deuterium * factors.deuterium;
                            }
                        ), 0),
                    stack: false,
                    showAverage: true,
                }
            ];
        }

        private getVisibleDatasets(datasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
            return datasets.filter(d => d.visible);
        }

        private getSum(datasets: ScollableChartFooterDataset[]): number {
            return datasets.filter(d => d.key != 'total').reduce((acc, cur) => acc + cur.value, 0);
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