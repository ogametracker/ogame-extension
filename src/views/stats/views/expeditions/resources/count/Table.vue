<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="expos"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgNumberFormat"
            show-percentage
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-resource :resource="resourceTypes[value]" size="24px" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const expos = computed(() => expeditionStore.dailyResultsArray);

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
        getValue: nextExpos => nextExpos.reduce((acc, expo) => acc + expo.findings.resourceCount[resource], 0),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return [{
        label: translations().extension.common.resourceUnits,
        getValue: nextExpos => nextExpos.reduce(
            (acc, expo) => acc
                + expo.findings.resourceCount.metal
                + expo.findings.resourceCount.crystal
                + expo.findings.resourceCount.deuterium,
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
