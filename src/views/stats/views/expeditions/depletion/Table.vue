<template>
    <div class="table-container">
        <RangedStatsTable
            :dataItems="expos"
            :items="items"
            :footerItems="footerItems"
            show-percentage
            show-average
            :averageNumberFormatOptions="avgFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <span
                    class="mdi"
                    :class="
                        {
                            unknown: 'mdi-help',
                            none: 'mdi-signal-cellular-outline',
                            low: 'mdi-signal-cellular-1',
                            medium: 'mdi-signal-cellular-2',
                            high: 'mdi-signal-cellular-3',
                        }[depletionLevelsByLabel[value]]
                    "
                    :style="{ color: colors[depletionLevelsByLabel[value]] }"
                />
            </template>
        </RangedStatsTable>

        <FloatingMenu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

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
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import {
    ExpeditionDepletionLevel,
    ExpeditionDepletionLevels,
} from '@ogame-tracker/shared/models/expeditions/ExpeditionDepletionLevel';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { _throw } from '@ogame-tracker/shared/utils/_throw';

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const avgFormat = ref<Intl.NumberFormatOptions>({
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const colors = computed(() => settingsStore.settings.colors.expeditions.depletion);

const expos = computed(() => expeditionStore.dailyResultsArray);

const depletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

const items = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return depletionLevels.map<RangedStatsTableItem<DailyExpeditionResult>>(level => ({
        label: translations().extension.expeditions.depletionLevels[level],
        getValue: nextExpos => nextExpos.reduce((acc, expo) => acc + expo.depletion[level], 0),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return [
        {
            label: translations().extension.common.sum,
            getValue: nextExpos =>
                depletionLevels.reduce(
                    (acc, type) => acc + nextExpos.reduce((acc, expo) => acc + expo.depletion[type], 0),
                    0,
                ),
        },
    ];
});

const depletionLevelsByLabel = computed<Record<string, ExpeditionDepletionLevel | 'unknown'>>(() => {
    return createRecord(
        depletionLevels.map(level => translations().extension.expeditions.depletionLevels[level]),
        label =>
            depletionLevels.find(level => label == translations().extension.expeditions.depletionLevels[level])
            ?? _throw(`failed to find depletion level for label '${label}'`),
    );
});
</script>

<style lang="scss" scoped>
.ranged-stats-table .mdi {
    transform: translateX(-30%) scale(1.6);
    width: 24px;
    display: inline-block;
}

.table-container {
    display: grid;
    column-gap: 4px;
    grid-template-columns: 1fr auto;
    align-items: start;
    height: 100%;
}
</style>
