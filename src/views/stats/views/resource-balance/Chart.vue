<template>
    <div class="chart-container">
        <StatsChart :datasets="datasets" :firstDay="firstDay" :itemsPerDay="eventsPerDay">
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="formatNumber(getResourcesAmount(getVisibleDatasets(datasets)))" />
                        <div v-text="translations().extension.common.resourceUnits" />

                        <div
                            class="number"
                            v-text="formatNumber(getConvertedResourcesAmount(getVisibleDatasets(datasets)))"
                        />
                        <div v-text="`${translations().extension.common.resourceUnits} (${conversionModeText})`" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="formatNumber(getResourcesAmount(datasets))" />
                    <div v-text="translations().extension.common.resourceUnits" />

                    <div class="number" v-text="formatNumber(getConvertedResourcesAmount(datasets))" />
                    <div v-text="`${translations().extension.common.resourceUnits} (${conversionModeText})`" />
                </div>
            </template>
        </StatsChart>

        <FloatingMenu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <ExpeditionShipResourceUnitsFactorSettings />
            <LostShipResourceUnitsFactorSettings />
            <hr class="two-column" />
            <IncludeShipsFoundOnExpeditionsInResourceBalanceSettings />
            <IncludeShipsLostInCombatsInResourceBalance />
            <IncludeLostLootResourcesInResourceBalance />
            <hr class="two-column" />
            <ConversionRateSettings />
            <ResourceColorSettings />
        </FloatingMenu>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import { computed, ref } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import StatsChart from '@stats/components/stats/StatsChart.vue';
import type { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import type { ScollableChartFooterDataset } from '@stats/components/common/scrollable-chart/ScrollableChart.vue';
import { useCombatReportStore } from '@stats/data/CombatReportDataModule';
import type { DailyCombatReportResult } from '@stats/data/CombatReportDataModule';
import min from 'date-fns/min/index';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '../../data/ExpeditionDataModule';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';
import type { DailyDebrisFieldReportResult } from '../../data/DebrisFieldReportDataModule';
import { useSettingsStore } from '../../data/SettingsDataModule';
import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
import ConversionRateSettings from '@stats/components/settings/ConversionRateSettings.vue';
import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
import IncludeShipsFoundOnExpeditionsInResourceBalanceSettings from '@stats/components/settings/resource-balance/IncludeShipsFoundOnExpeditionsInResourceBalanceSettings.vue';
import IncludeShipsLostInCombatsInResourceBalance from '@stats/components/settings/resource-balance/IncludeShipsLostInCombatsInResourceBalance.vue';
import IncludeLostLootResourcesInResourceBalance from '@stats/components/settings/resource-balance/IncludeLostLootResourcesInResourceBalance.vue';
import { getMsuOrDsu } from '../../models/settings/getMsuOrDsu';

interface DayEvents {
    expeditions?: DailyExpeditionResult;
    combatReports?: DailyCombatReportResult;
    debrisFieldReports?: DailyDebrisFieldReportResult;
}

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const combatReportStore = useCombatReportStore();

const debrisFieldReportStore = useDebrisFieldReportStore();

const showSettings = ref(false);

const colors = computed(() => settingsStore.settings.colors.resources);

const includeFoundShipsFactor = computed<Record<ResourceType, number>>(() => {
    const { factor, deuteriumFactor } = settingsStore.settings.expeditionFoundShipsResourceUnits;
    const settingFactor = includeFoundShips.value ? 1 : 0;

    return {
        [ResourceType.metal]: factor * settingFactor,
        [ResourceType.crystal]: factor * settingFactor,
        [ResourceType.deuterium]: deuteriumFactor * settingFactor,
    };
});

const includeLostShipsFactor = computed<Record<ResourceType, number>>(() => {
    const { factor, deuteriumFactor } = settingsStore.settings.lostShipsResourceUnits;
    const settingFactor = includeLostShips.value ? 1 : 0;

    return {
        [ResourceType.metal]: factor * settingFactor,
        [ResourceType.crystal]: factor * settingFactor,
        [ResourceType.deuterium]: deuteriumFactor * settingFactor,
    };
});

const includeFoundShips = computed(
    () => settingsStore.settings.resourceBalance.includeExpeditionFoundShipsResourceUnits,
);

const includeLostShips = computed(() => settingsStore.settings.resourceBalance.includeLostShipsResourceUnits);

const includeLostLoot = computed(() => settingsStore.settings.resourceBalance.includeLostLootResources);

const conversionModeText = computed(() => {
    return settingsStore.settings.conversionRates.mode == 'msu'
        ? translations().extension.common.msu
        : translations().extension.common.dsu;
});

const firstDay = computed(() => {
    return min([expeditionStore.firstDay, combatReportStore.firstDay, debrisFieldReportStore.firstDay]);
});

const eventsPerDay = computed<Record<number, DayEvents>>(() => {
    const result: Record<number, DayEvents> = {};

    Object.keys(expeditionStore.dailyResults).forEach(dayStr => {
        const day = parseInt(dayStr, 10);
        result[day] ??= {};
        result[day].expeditions = expeditionStore.dailyResults[day];
    });
    Object.keys(combatReportStore.dailyResults).forEach(dayStr => {
        const day = parseInt(dayStr, 10);
        result[day] ??= {};
        result[day].combatReports = combatReportStore.dailyResults[day];
    });
    Object.keys(debrisFieldReportStore.dailyResults).forEach(dayStr => {
        const day = parseInt(dayStr, 10);
        result[day] ??= {};
        result[day].debrisFieldReports = debrisFieldReportStore.dailyResults[day];
    });

    return result;
});

const datasets = computed<StatsChartDataset<DayEvents>[]>(() => {
    return [
        ...ResourceTypes.map(resource => ({
            key: resource,
            label: translations().extension.resources[resource],
            color: colors.value[resource],
            filled: true,
            getValue: (dayEvents: DayEvents) => getResource(dayEvents, resource),
            showAverage: true,
        })),
        {
            key: 'total',
            label: `${translations().extension.common.resourceUnits} (${settingsStore.settings.conversionRates.mode == 'msu' ? translations().extension.common.msu : translations().extension.common.dsu})`,
            color: colors.value.totalConverted,
            filled: false,
            getValue: dayEvents =>
                getMsuOrDsu({
                    metal: getResource(dayEvents, ResourceType.metal),
                    crystal: getResource(dayEvents, ResourceType.crystal),
                    deuterium: getResource(dayEvents, ResourceType.deuterium),
                }),
            stack: false,
            showAverage: true,
        },
    ];
});

function getVisibleDatasets(nextDatasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
    return nextDatasets.filter(d => d.visible);
}

function getResourcesAmount(nextDatasets: ScollableChartFooterDataset[]): number {
    const resources: string[] = [ResourceType.metal, ResourceType.crystal, ResourceType.deuterium];
    return nextDatasets.filter(d => resources.includes(d.key.toString())).reduce((acc, cur) => acc + cur.value, 0);
}

function getConvertedResourcesAmount(nextDatasets: ScollableChartFooterDataset[]): number {
    return nextDatasets.reduce((acc, cur) => {
        if (!(ResourceTypes as (string | number)[]).includes(cur.key)) {
            return acc;
        }
        return acc + getMsuOrDsu({ [cur.key as ResourceType]: cur.value });
    }, 0);
}

function getResource(dayEvents: DayEvents, resource: ResourceType): number {
    return (
        getExpeditionResourceAmount(dayEvents.expeditions, resource) +
        getCombatResourceAmount(dayEvents.combatReports, resource) +
        getDebrisFieldResourceAmount(dayEvents.debrisFieldReports, resource)
    );
}

function getExpeditionResourceAmount(expeditions: DailyExpeditionResult | undefined, resource: ResourceType): number {
    if (expeditions == null) {
        return 0;
    }

    const localIncludeFoundShipsFactor = includeFoundShipsFactor.value[resource];
    const total =
        expeditions.findings.resources[resource] +
        expeditions.findings.fleetResourceUnits[resource] * localIncludeFoundShipsFactor;

    return total;
}

function getCombatResourceAmount(dailyReports: DailyCombatReportResult | undefined, resource: ResourceType): number {
    if (dailyReports == null) {
        return 0;
    }

    const lostLootFactor = includeLostLoot.value ? 1 : 0;
    const lootResources = dailyReports.loot.lost[resource] * lostLootFactor + dailyReports.loot.gained[resource];

    const localIncludeLostShipsFactor = includeLostShipsFactor.value[resource];
    const lostShipResourceUnits =
        (dailyReports.lostShips.onExpeditions.resourceUnits[resource] +
            dailyReports.lostShips.againstPlayers.resourceUnits[resource]) *
        localIncludeLostShipsFactor;

    const total = lootResources - lostShipResourceUnits;

    return total;
}

function getDebrisFieldResourceAmount(
    reports: DailyDebrisFieldReportResult | undefined,
    resource: ResourceType,
): number {
    if (reports == null) {
        return 0;
    }

    return reports.total[resource];
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

.floating-settings:deep(.floating-menu) {
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
