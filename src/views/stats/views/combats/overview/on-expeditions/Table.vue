<template>
    <div class="table-container">
        <RangedStatsTable
            :dataItems="combats"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgNumberFormat"
        />

        <FloatingMenu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <CombatTrackingIgnoreEspionageCombatsSettings />
            <hr />
            <DateRangeSettings />
        </FloatingMenu>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import { useCombatReportStore } from '@stats/data/CombatReportDataModule';
import type { DailyCombatReportResult } from '@stats/data/CombatReportDataModule';
import { CombatResultTypes } from '@ogame-tracker/shared/models/combat-reports/CombatResultType';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';

const combatReportStore = useCombatReportStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const combats = computed(() => combatReportStore.dailyResultsArray);

const items = computed<RangedStatsTableItem<DailyCombatReportResult>[]>(() => {
    return CombatResultTypes.map(result => ({
        label: translations().extension.combats.combatResults[result],
        getValue: nextCombats => nextCombats.reduce((acc, cur) => acc + cur.results.onExpeditions[result], 0),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyCombatReportResult>[]>(() => {
    return [
        {
            label: translations().extension.common.resourceUnits,
            getValue: nextCombats =>
                CombatResultTypes.reduce(
                    (acc, result) => acc + nextCombats.reduce((acc, cur) => acc + cur.results.onExpeditions[result], 0),
                    0,
                ),
        },
    ];
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
</style>
