<template>
    <div class="table-container">
        <RangedStatsTable :dataItems="expos" :items="items" :footerItems="footerItems" show-percentage show-average :averageNumberFormatOptions="avgFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <ExpeditionEventTypeIcon :type="getExpeditionEventType(value)" />
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
import { ExpeditionEventType, ExpeditionEventTypes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import { ItemHash } from '@ogame-tracker/shared/models/ogame/items/ItemHash';
import ExpeditionEventTypeIcon from '@stats/components/expeditions/ExpeditionEventTypeIcon.vue';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { _throw } from '@ogame-tracker/shared/utils/_throw';

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const detroidItem = ItemHash.detroid_bronze;

const avgFormat = ref<Intl.NumberFormatOptions>({
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

function getExpeditionEventType(text: string): ExpeditionEventType {
    const reverseMap = createRecord(ExpeditionEventTypes, type => translations().extension.expeditions.expeditionEvents[type]);
    return (Object.entries(reverseMap) as [ExpeditionEventType, string][])
        .find(e => e[1] == text)?.[0]
        ?? _throw('failed to find fitting type');
}

const colors = computed(() => settingsStore.settings.colors.expeditions.events);

const expos = computed(() => expeditionStore.dailyResultsArray);

const items = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return ExpeditionEventTypes
        .filter(type => ![ExpeditionEventType.aliens, ExpeditionEventType.pirates].includes(type))
        .map(type => ({
            label: translations().extension.expeditions.expeditionEvents[type],
            getValue: nextExpos => nextExpos.reduce((acc, expo) => acc + expo.events[type], 0),
        }));
});

const footerItems = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return [{
        label: translations().extension.common.sum,
        getValue: nextExpos => ExpeditionEventTypes.reduce(
            (acc, type) => acc + nextExpos.reduce((acc, expo) => acc + expo.events[type], 0),
            0
        ),
    }];
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
