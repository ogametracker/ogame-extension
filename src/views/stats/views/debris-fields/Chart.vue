<template>
    <div class="chart-container">
        <StatsChart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="reportsPerDay" no-tooltip-footer />

        <span class="multi-menu">
            <FloatingMenu v-model="showSettings" left class="floating-settings">
                <template #activator>
                    <button @click="showSettings = !showSettings">
                        <span class="mdi mdi-cog" />
                    </button>
                </template>

                <ConversionRateSettings />
                <SeparateExpeditionAndNormalDebrisFieldSettings />
                <hr class="two-column" />
                <ResourceColorSettings />
            </FloatingMenu>

            <ManuallyAddDebrisFieldMenu />
        </span>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import StatsChart from '@stats/components/stats/StatsChart.vue';
import type { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';
import type { DailyDebrisFieldReportResult } from '../../data/DebrisFieldReportDataModule';
import { useSettingsStore } from '../../data/SettingsDataModule';
import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
import ConversionRateSettings from '@stats/components/settings/ConversionRateSettings.vue';
import ManuallyAddDebrisFieldMenu from '@stats/components/debris-fields/ManuallyAddDebrisFieldMenu.vue';
import SeparateExpeditionAndNormalDebrisFieldSettings from '@stats/components/settings/debris-fields/SeparateExpeditionAndNormalDebrisFieldSettings.vue';
import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';

const settingsStore = useSettingsStore();

const debrisFieldReportStore = useDebrisFieldReportStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.resources);

const firstDay = computed(() => debrisFieldReportStore.firstDay);

const reportsPerDay = computed(() => debrisFieldReportStore.dailyResults);

const separateResults = computed(() => settingsStore.settings.debrisFields.separateExpeditionDebrisFields);

const alternativeColors: Record<ResourceType, string> = {
    metal: '#fbbc04',
    crystal: '#4b17da',
    deuterium: '#ff0000', //TODO:
};

const datasets = computed<StatsChartDataset<DailyDebrisFieldReportResult>[]>(() => {
    if (!separateResults.value) {
        return [
            ...ResourceTypes.map(resource => ({
                key: resource,
                label: translations().extension.resources[resource],
                color: colors.value[resource],
                filled: true,
                getValue: (result: DailyDebrisFieldReportResult) => result.total[resource],
                showAverage: true,
            })),
            {
                key: 'total',
                label: `${translations().extension.common.resourceUnits} (${settingsStore.settings.conversionRates.mode == 'msu' ? translations().extension.common.msu : translations().extension.common.dsu})`,
                color: colors.value.totalConverted,
                filled: false,
                getValue: result => getMsuOrDsu(result.total),
                stack: false,
                showAverage: true,
            },
        ];
    }

    return [
        ...ResourceTypes.map(resource => ({
            key: `${resource}-normal`,
            label: `${translations().extension.resources[resource]} (${translations().extension.debrisFields.position} 1-15)`,
            color: colors.value[resource],
            filled: true,
            getValue: (result: DailyDebrisFieldReportResult) => result.normal[resource],
            showAverage: true,
        })),
        ...ResourceTypes.map(resource => ({
            key: `${resource}-pos16`,
            label: `${translations().extension.resources[resource]} (${translations().extension.debrisFields.position} 16)`,
            color: alternativeColors[resource],
            filled: true,
            getValue: (result: DailyDebrisFieldReportResult) => result.expedition[resource],
            showAverage: true,
        })),
        {
            key: 'total',
            label: `${translations().extension.common.resourceUnits} (${settingsStore.settings.conversionRates.mode == 'msu' ? translations().extension.common.msu : translations().extension.common.dsu})`,
            color: colors.value.totalConverted,
            filled: false,
            getValue: result => getMsuOrDsu(result.total),
            stack: false,
            showAverage: true,
        },
    ];
});
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

.floating-settings:deep(.floating-menu) {
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
