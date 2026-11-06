<template>
    <div class="table-container">
        <RangedStatsTable
            :dataItems="expos"
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
            <ExpeditionShipResourceUnitsFactorSettings />
            <hr class="two-column" />
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
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import ConversionRateSettings from '@stats/components/settings/ConversionRateSettings.vue';
import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import { getMsuOrDsu } from '@stats/models/settings/getMsuOrDsu';

const expeditionStore = useExpeditionStore();

const settingsStore = useSettingsStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const expos = computed(() => expeditionStore.dailyResultsArray);

const factors = computed(() => {
    const localFactors = settingsStore.settings.expeditionFoundShipsResourceUnits;
    return {
        [ResourceType.metal]: localFactors.factor,
        [ResourceType.crystal]: localFactors.factor,
        [ResourceType.deuterium]: localFactors.deuteriumFactor,
    };
});

const resourceTypes = computed<Record<string, ResourceType>>(() => {
    return {
        [translations().extension.resources.metal]: ResourceType.metal,
        [translations().extension.resources.crystal]: ResourceType.crystal,
        [translations().extension.resources.deuterium]: ResourceType.deuterium,
    };
});

const items = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return ResourceTypes.map(resource => ({
        label: translations().extension.resources[resource],
        getValue: nextExpos =>
            nextExpos.reduce(
                (acc, expo) => acc + expo.findings.fleetResourceUnits[resource] * factors.value[resource],
                0,
            ),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    const result: RangedStatsTableItem<DailyExpeditionResult>[] = [
        {
            label: translations().extension.common.resourceUnits,
            getValue: nextExpos =>
                nextExpos.reduce(
                    (acc, expo) =>
                        acc +
                        expo.findings.fleetResourceUnits.metal * factors.value.metal +
                        expo.findings.fleetResourceUnits.crystal * factors.value.crystal +
                        expo.findings.fleetResourceUnits.deuterium * factors.value.deuterium,
                    0,
                ),
        },
    ];

    if (settingsStore.settings.showCellsWithConvertedResourceUnits) {
        result.push({
            label: `${translations().extension.common.resourceUnits} (${settingsStore.settings.conversionRates.mode == 'msu' ? translations().extension.common.msu : translations().extension.common.dsu})`,
            getValue: nextExpos =>
                nextExpos.reduce((acc, expo) => acc + getMsuOrDsu(expo.findings.fleetResourceUnits, factors.value), 0),
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
