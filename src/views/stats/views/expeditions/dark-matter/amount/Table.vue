<template>
    <div class="table-container">
        <RangedStatsTable :dataItems="expos" :items="items" show-average :averageNumberFormatOptions="avgFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <OResource resource="dark-matter" size="24px" />
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
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const avgFormat = ref<Intl.NumberFormatOptions>({
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const expos = computed(() => expeditionStore.dailyResultsArray);

const items = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return [
        {
            label: translations().ogame.premium.darkMatter,
            getValue: nextExpos => nextExpos.reduce((acc, expo) => acc + expo.findings.darkMatter, 0),
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
