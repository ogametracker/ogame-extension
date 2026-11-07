<template>
    <div class="table-container">
        <RangedStatsTable
            :dataItems="reportsPerDay"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgNumberFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <OResource :resource="resourceTypes[value]" size="24px" />
            </template>
        </RangedStatsTable>

        <FloatingMenu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <ConversionRateSettings />
            <LostShipResourceUnitsFactorSettings />
            <hr class="two-column" />
            <CombatTrackingIgnoreEspionageCombatsSettings />
            <ShowConvertedResourcesInCellsSettings />
            <hr class="two-column" />
            <DateRangeSettings class="two-column" />
        </FloatingMenu>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import { useCombatReportStore } from '@stats/data/CombatReportDataModule';
import type { DailyCombatReportResult } from '@stats/data/CombatReportDataModule';
import ConversionRateSettings from '@stats/components/settings/ConversionRateSettings.vue';
import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';
import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import { getMsuOrDsu } from '@stats/models/settings/getMsuOrDsu';

const settingsStore = useSettingsStore();

const combatReportStore = useCombatReportStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const colors = computed(() => settingsStore.settings.colors.resources);

const factors = computed(() => settingsStore.settings.lostShipsResourceUnits);

const firstDay = computed(() => combatReportStore.firstDay);

const reportsPerDay = computed(() => combatReportStore.dailyResultsArray);

const resourceTypes = computed<Record<string, ResourceType>>(() => {
    return {
        [translations().extension.resources.metal]: ResourceType.metal,
        [translations().extension.resources.crystal]: ResourceType.crystal,
        [translations().extension.resources.deuterium]: ResourceType.deuterium,
    };
});

const items = computed<RangedStatsTableItem<DailyCombatReportResult>[]>(() => {
    const localFactors: Record<ResourceType, number> = {
        [ResourceType.metal]: factors.value.factor,
        [ResourceType.crystal]: factors.value.factor,
        [ResourceType.deuterium]: factors.value.deuteriumFactor,
    };

    return ResourceTypes.map(resource => ({
        label: translations().extension.resources[resource],
        getValue: reports =>
            reports.reduce(
                (acc, report) => acc + report.lostShips.onExpeditions.resourceUnits[resource] * localFactors[resource],
                0,
            ),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyCombatReportResult>[]>(() => {
    const localFactors: Record<ResourceType, number> = {
        [ResourceType.metal]: factors.value.factor,
        [ResourceType.crystal]: factors.value.factor,
        [ResourceType.deuterium]: factors.value.deuteriumFactor,
    };

    const result: RangedStatsTableItem<DailyCombatReportResult>[] = [
        {
            label: translations().extension.common.resourceUnits,
            getValue: reports =>
                reports.reduce(
                    (acc, report) =>
                        acc
                        + report.lostShips.onExpeditions.resourceUnits.metal * localFactors.metal
                        + report.lostShips.onExpeditions.resourceUnits.crystal * localFactors.crystal
                        + report.lostShips.onExpeditions.resourceUnits.deuterium * localFactors.deuterium,
                    0,
                ),
        },
    ];

    if (settingsStore.settings.showCellsWithConvertedResourceUnits) {
        result.push({
            label: `${translations().extension.common.resourceUnits} (${settingsStore.settings.conversionRates.mode == 'msu' ? translations().extension.common.msu : translations().extension.common.dsu})`,
            getValue: reports =>
                reports.reduce(
                    (acc, report) => acc + getMsuOrDsu(report.lostShips.onExpeditions.resourceUnits, localFactors),
                    0,
                ),
        });
    }

    return result;
});
</script>

<style lang="scss" scoped>
.table-container {
    display: grid;
    column-gap: 4px;
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
