<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="discoveries"
            :items="items"
            :footerItems="footerItems"
            show-average
            show-percentage
            :averageNumberFormatOptions="avgNumberFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <span v-if="value == translations().extension.empire.lifeforms.eventTypes.nothing" class="mdi mdi-close" :style="{ color: colors.nothing }" />
                <span
                    v-else-if="value == translations().extension.empire.lifeforms.eventTypes.lostShip"
                    class="mdi mdi-skull-crossbones-outline"
                    :style="{ color: colors.lostShip }"
                />
                <span v-else-if="value == lifeformFoundLabel" class="mdi mdi-star-shooting" :style="{ color: colors.knownLifeformFound }" />
                <span
                    v-else-if="value == translations().extension.empire.lifeforms.eventTypes.artifacts"
                    class="mdi mdi-pyramid"
                    :style="{ color: colors.artifacts }"
                />
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
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import { LifeformDiscoveryEventType } from '@ogame-tracker/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
import { useLifeformDiscoveryStore } from '@stats/data/LifeformDiscoveryDataModule';
import type { DailyLifeformDiscoveryResult } from '@stats/data/LifeformDiscoveryDataModule';
import { useSettingsStore } from '@stats/data/SettingsDataModule';

const lifeformDiscoveryStore = useLifeformDiscoveryStore();

const settingsStore = useSettingsStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const discoveries = computed(() => lifeformDiscoveryStore.dailyResultsArray);

const colors = computed(() => settingsStore.settings.colors.lifeformDiscoveries.events);

const eventTypes = computed<Record<string, LifeformDiscoveryEventType>>(() => {
    return {
        [translations().extension.empire.lifeforms.eventTypes.nothing]: LifeformDiscoveryEventType.nothing,
        [translations().extension.empire.lifeforms.eventTypes.lostShip]: LifeformDiscoveryEventType.lostShip,
        [translations().extension.empire.lifeforms.eventTypes.newLifeformFound]: LifeformDiscoveryEventType.newLifeformFound,
        [translations().extension.empire.lifeforms.eventTypes.knownLifeformFound]: LifeformDiscoveryEventType.knownLifeformFound,
        [translations().extension.empire.lifeforms.eventTypes.artifacts]: LifeformDiscoveryEventType.artifacts,
    };
});

const lifeformFoundLabel = computed(() => translations().extension.empire.lifeforms.lifeformFound);

const items = computed<RangedStatsTableItem<DailyLifeformDiscoveryResult>[]>(() => {
    const typeGroups: LifeformDiscoveryEventType[][] = [
        [LifeformDiscoveryEventType.nothing],
        [LifeformDiscoveryEventType.lostShip],
        [LifeformDiscoveryEventType.newLifeformFound, LifeformDiscoveryEventType.knownLifeformFound],
        [LifeformDiscoveryEventType.artifacts],
    ]
    return typeGroups.map(group => ({
        label: group.length == 1 ? translations().extension.empire.lifeforms.eventTypes[group[0]] : lifeformFoundLabel.value,
        getValue: nextDiscoveries => nextDiscoveries.reduce(
            (acc, disc) => acc + group.reduce((acc, cur) => acc + disc.events[cur], 0),
            0
        ),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyLifeformDiscoveryResult>[]>(() => {
    return [{
        label: translations().extension.common.sum,
        getValue: nextDiscoveries => nextDiscoveries.reduce(
            (acc, disc) => acc + Object.values(disc.events).reduce((acc, cur) => acc + cur, 0),
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
