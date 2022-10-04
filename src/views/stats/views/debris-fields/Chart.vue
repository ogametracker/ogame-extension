<template>
    <div class="chart-container">
        <stats-chart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="reportsPerDay" no-tooltip-footer />

        <span class="multi-menu">
            <floating-menu v-model="showSettings" left class="floating-settings">
                <template #activator>
                    <button @click="showSettings = !showSettings">
                        <span class="mdi mdi-cog" />
                    </button>
                </template>

                <conversion-rate-settings />
                <separate-expedition-and-normal-debris-field-settings />
                <hr class="two-column" />
                <resource-color-settings />
            </floating-menu>

            <manually-add-debris-field-menu />
        </span>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { DailyDebrisFieldReportResult, DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import ManuallyAddDebrisFieldMenu from '@stats/components/debris-fields/ManuallyAddDebrisFieldMenu.vue';
    import SeparateExpeditionAndNormalDebrisFieldSettings from '@stats/components/settings/debris-fields/SeparateExpeditionAndNormalDebrisFieldSettings.vue';
    import { getRGB, getRGBString } from '../../utils/getRGBString';
import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';

    @Component({
        components: {
            StatsChart,
            ResourceColorSettings,
            ConversionRateSettings,
            ManuallyAddDebrisFieldMenu,
            SeparateExpeditionAndNormalDebrisFieldSettings,
        },
    })
    export default class Charts extends Vue {

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.resources;
        }

        private get firstDay() {
            return DebrisFieldReportDataModule.firstDay;
        }

        private get reportsPerDay() {
            return DebrisFieldReportDataModule.dailyResults;
        }

        private get separateResults() {
            return SettingsDataModule.settings.debrisFields.separateExpeditionDebrisFields;
        }

        private readonly alternativeColors = {
            metal: '#fbbc04',
            crystal: '#4b17da',
        }

        private get datasets(): StatsChartDataset<DailyDebrisFieldReportResult>[] {
            const resources: (ResourceType.metal | ResourceType.crystal)[] = [ResourceType.metal, ResourceType.crystal];

            if (!this.separateResults) {
                return [
                    ...resources.map(resource => ({
                        key: resource,
                        label: this.$i18n.$t.extension.resources[resource],
                        color: this.colors[resource],
                        filled: true,
                        getValue: (result: DailyDebrisFieldReportResult) => result.total[resource],
                        showAverage: true,
                    })),
                    {
                        key: 'total',
                        label: `${this.$i18n.$t.extension.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.extension.common.msu : this.$i18n.$t.extension.common.dsu})`,
                        color: this.colors.totalConverted,
                        filled: false,
                        getValue: result => getMsuOrDsu(result.total),
                        stack: false,
                        showAverage: true,
                    }
                ];
            }

            return [
                ...resources.map(resource => ({
                    key: `${resource}-normal`,
                    label: `${this.$i18n.$t.extension.resources[resource]} (${this.$i18n.$t.extension.debrisFields.position} 1-15)`,
                    color: this.colors[resource],
                    filled: true,
                    getValue: (result: DailyDebrisFieldReportResult) => result.normal[resource],
                    showAverage: true,
                })),
                ...resources.map(resource => ({
                    key: `${resource}-pos16`,
                    label: `${this.$i18n.$t.extension.resources[resource]} (${this.$i18n.$t.extension.debrisFields.position} 16)`,
                    color: this.alternativeColors[resource],
                    filled: true,
                    getValue: (result: DailyDebrisFieldReportResult) => result.expedition[resource],
                    showAverage: true,
                })),
                {
                    key: 'total',
                    label: `${this.$i18n.$t.extension.common.resourceUnits} (${SettingsDataModule.settings.conversionRates.mode == 'msu' ? this.$i18n.$t.extension.common.msu : this.$i18n.$t.extension.common.dsu})`,
                    color: this.colors.totalConverted,
                    filled: false,
                    getValue: result => getMsuOrDsu(result.total),
                    stack: false,
                    showAverage: true,
                }
            ];
        }
    }
</script>
<style lang="scss" scoped>
    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }

    .multi-menu {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .floating-settings::v-deep .floating-menu {
        display: grid;
        grid-template-columns: repeat(2, auto);
        column-gap: 8px;

        .two-column {
            grid-column: 1 / span 2;
        }

        hr {
            width: 100%;
        }
    }
</style>