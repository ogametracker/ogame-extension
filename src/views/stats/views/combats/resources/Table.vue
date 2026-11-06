<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="combats" :items="items" :footerItems="footerItems" show-average :averageNumberFormatOptions="avgNumberFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-resource :resource="resourceTypes[value]" size="24px" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left class="floating-settings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <conversion-rate-settings />
            <combat-tracking-ignore-espionage-combats-settings />
            <hr class="two-column" />
            <show-converted-resources-in-cells-settings />
            <hr class="two-column" />
            <date-range-settings class="two-column"  />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { useCombatReportStore } from '@stats/data/CombatReportDataModule';
import type { DailyCombatReportResult } from '@stats/data/CombatReportDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import ConversionRateSettings from '@stats/components/settings/ConversionRateSettings.vue';
import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';
import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import { getMsuOrDsu } from '@stats/models/settings/getMsuOrDsu';

const combatReportStore = useCombatReportStore();

const settingsStore = useSettingsStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const combats = computed(() => combatReportStore.dailyResultsArray);

const resourceTypes = computed<Record<string, ResourceType>>(() => {
    return {
        [translations().extension.resources.metal]: ResourceType.metal,
        [translations().extension.resources.crystal]: ResourceType.crystal,
        [translations().extension.resources.deuterium]: ResourceType.deuterium,
    };
});

const items = computed<RangedStatsTableItem<DailyCombatReportResult>[]>(() => {
    return ResourceTypes.map(resource => ({
        label: translations().extension.resources[resource],
        getValue: nextCombats => nextCombats.reduce((acc, combat) => acc + combat.loot.total[resource], 0),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyCombatReportResult>[]>(() => {
    const result: RangedStatsTableItem<DailyCombatReportResult>[] = [
        {
            label: translations().extension.common.resourceUnits,
            getValue: nextCombats => nextCombats.reduce(
                (acc, combat) => acc + combat.loot.total.metal + combat.loot.total.crystal + combat.loot.total.deuterium,
                0
            ),
        },
    ];

    if (settingsStore.settings.showCellsWithConvertedResourceUnits) {
        result.push({
            label: `${translations().extension.common.resourceUnits} (${settingsStore.settings.conversionRates.mode == 'msu' ? translations().extension.common.msu : translations().extension.common.dsu})`,
            getValue: nextCombats => nextCombats.reduce(
                (acc, combat) => acc + getMsuOrDsu(combat.loot.total),
                0
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
