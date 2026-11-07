<template>
    <div class="table-container">
        <RangedStatsTable
            :dataItems="debrisFieldReports"
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

        <span class="multi-menu">
            <FloatingMenu v-model="showSettings" left class="floating-settings">
                <template #activator>
                    <button @click="showSettings = !showSettings">
                        <span class="mdi mdi-cog" />
                    </button>
                </template>

                <ConversionRateSettings />
                <ShowConvertedResourcesInCellsSettings />
                <SeparateExpeditionAndNormalDebrisFieldSettings />
                <hr class="three-column" />
                <DateRangeSettings class="three-column" />
            </FloatingMenu>
            <ManuallyAddDebrisFieldMenu />
        </span>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import { useDebrisFieldReportStore } from '@stats/data/DebrisFieldReportDataModule';
import type { DailyDebrisFieldReportResult } from '@stats/data/DebrisFieldReportDataModule';
import { useSettingsStore } from '../../data/SettingsDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import ConversionRateSettings from '@stats/components/settings/ConversionRateSettings.vue';
import ManuallyAddDebrisFieldMenu from '@stats/components/debris-fields/ManuallyAddDebrisFieldMenu.vue';
import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import SeparateExpeditionAndNormalDebrisFieldSettings from '@stats/components/settings/debris-fields/SeparateExpeditionAndNormalDebrisFieldSettings.vue';
import { getMsuOrDsu } from '@stats/models/settings/getMsuOrDsu';

const settingsStore = useSettingsStore();

const debrisFieldReportStore = useDebrisFieldReportStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const resourceTypes = computed<Record<string, ResourceType>>(() => {
    return {
        [translations().extension.resources.metal]: ResourceType.metal,
        [translations().extension.resources.crystal]: ResourceType.crystal,
        [translations().extension.resources.deuterium]: ResourceType.deuterium,
    };
});

const separate = computed(() => settingsStore.settings.debrisFields.separateExpeditionDebrisFields);

const items = computed<RangedStatsTableItem<DailyDebrisFieldReportResult>[]>(() => {
    if (separate.value) {
        return ResourceTypes.map(resource => ({
            label: translations().extension.resources[resource],
            items: (['normal', 'expedition', 'total'] as ('normal' | 'expedition' | 'total')[]).map(key => ({
                label: {
                    normal: `${translations().extension.debrisFields.position} 1-15`,
                    expedition: `${translations().extension.debrisFields.position} 16`,
                    total: translations().extension.common.sum,
                }[key],
                getValue: reports => reports.reduce((acc, report) => acc + report[key][resource], 0),
                class: key == 'total' ? 'sum-item' : '',
                labelClass: key == 'total' ? 'sum-item' : '',
            })),
        }));
    }

    return ResourceTypes.map(resource => ({
        label: translations().extension.resources[resource],
        getValue: reports => reports.reduce((acc, report) => acc + report.total[resource], 0),
    }));
});

const debrisFieldReports = computed(() => debrisFieldReportStore.dailyResultsArray);

const footerItems = computed<RangedStatsTableItem<DailyDebrisFieldReportResult>[]>(() => {
    const result: RangedStatsTableItem<DailyDebrisFieldReportResult>[] = [
        {
            label: translations().extension.common.resourceUnits,
            getValue: reports =>
                reports.reduce(
                    (acc, report) => acc + report.total.metal + report.total.crystal + report.total.deuterium,
                    0,
                ),
        },
    ];

    if (settingsStore.settings.showCellsWithConvertedResourceUnits) {
        result.push({
            label: `${translations().extension.common.resourceUnits} (${settingsStore.settings.conversionRates.mode == 'msu' ? translations().extension.common.msu : translations().extension.common.dsu})`,
            getValue: reports => reports.reduce((acc, report) => acc + getMsuOrDsu(report.total), 0),
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

    :deep(.sum-item) {
        font-weight: bold;
        border-top: 1px solid rgba(var(--color), 0.5);
        margin-top: 1px;
    }
}

.multi-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.floating-settings:deep(.floating-menu) {
    display: grid;
    grid-template-columns: repeat(3, auto);
    column-gap: 8px;

    .three-column {
        grid-column: 1 / span 3;
    }

    hr {
        width: 100%;
    }
}
</style>
