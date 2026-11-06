<template>
    <div class="table-container">
        <RangedStatsTable
            :dataItems="discoveries"
            :items="items"
            :footerItems="footerItems"
            show-average
            show-percentage
            :averageNumberFormatOptions="avgNumberFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <OLifeform :lifeform="lifeformTypes[value]" size="24px" />
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
import OLifeform from '@ogame-tracker/view-shared/components/ogame/OLifeform.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import { useLifeformDiscoveryStore } from '@stats/data/LifeformDiscoveryDataModule';
import type { DailyLifeformDiscoveryResult } from '@stats/data/LifeformDiscoveryDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import { LifeformType, ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const settingsStore = useSettingsStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const discoveries = computed(() => lifeformDiscoveryStore.dailyResultsArray);

const colors = computed(() => settingsStore.settings.colors.lifeforms);

const lifeformTypes = computed<Record<string, LifeformType>>(() => {
    return {
        [translations().ogame.lifeforms.humans]: LifeformType.humans,
        [translations().ogame.lifeforms.rocktal]: LifeformType.rocktal,
        [translations().ogame.lifeforms.mechas]: LifeformType.mechas,
        [translations().ogame.lifeforms.kaelesh]: LifeformType.kaelesh,
    };
});

const items = computed<RangedStatsTableItem<DailyLifeformDiscoveryResult>[]>(() => {
    return ValidLifeformTypes.map(lifeform => ({
        label: translations().ogame.lifeforms[lifeform],
        getValue: nextDiscoveries => nextDiscoveries.reduce(
            (acc, disc) => acc + disc.lifeformExperience[lifeform],
            0
        ),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyLifeformDiscoveryResult>[]>(() => {
    return [{
        label: translations().extension.common.sum,
        getValue: nextDiscoveries => nextDiscoveries.reduce(
            (acc, disc) => acc + Object.values(disc.lifeformExperience).reduce((acc, cur) => acc + cur, 0),
            0
        ),
    }];
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
