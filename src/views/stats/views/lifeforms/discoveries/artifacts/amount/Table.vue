<template>
    <div class="table-container">
        <RangedStatsTable :dataItems="missions" :items="items" show-percentage>
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />
                <span class="mdi mdi-pyramid" :style="{ color: color }" />
            </template>
        </RangedStatsTable>

        <FloatingMenu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <DateRangeSettings />
            <LifeformDiscoveryColorSettings />
        </FloatingMenu>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import LifeformDiscoveryColorSettings from '@stats/components/settings/colors/LifeformDiscoveryColorSettings.vue';
import { useLifeformDiscoveryStore } from '@stats/data/LifeformDiscoveryDataModule';
import type { DailyLifeformDiscoveryResult } from '@stats/data/LifeformDiscoveryDataModule';

const settingsStore = useSettingsStore();

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const showSettings = ref(false);

const color = computed(() => settingsStore.settings.colors.lifeformDiscoveries.events.artifacts);

const missions = computed(() => lifeformDiscoveryStore.dailyResultsArray);

const items = computed<RangedStatsTableItem<DailyLifeformDiscoveryResult>[]>(() => {
    return [
        {
            label: translations().extension.empire.lifeforms.artifacts,
            getValue: nextMissions => nextMissions.reduce((acc, expo) => acc + expo.artifacts, 0),
        },
    ];
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
