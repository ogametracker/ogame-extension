<template>
    <LoadingSpinner v-if="loading" />
    <GridTable v-else :columns="allianceHistoryColumns" :items="allianceHistoryItems" inline>
        <template #cell-alliance="{ value }">
            <span v-if="value != null" v-text="`[${value.tag}] ${value.name}`" />
            <i v-else v-text="translations().extension.universeHistory.noAlliance" />
        </template>

        <template #cell-start="{ value }">
            <span v-if="value != null" v-text="formatDate(value, 'date')" />
            <span v-else v-text="'?'" />
        </template>

        <template #cell-->-</template>

        <template #cell-end="{ value }">
            <span v-if="value != null" v-text="formatDate(value, 'date')" />
            <span v-else v-text="translations().extension.universeHistory.today" />
        </template>
    </GridTable>
</template>

<script setup lang="ts">
import GridTable from '@stats/components/common/GridTable.vue';
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import { computed, ref, watch } from 'vue';
import { translations, formatDate } from '@stats/i18n';
import type { OgameTrackerUniverseHistoryPlayerAlliance } from '@ogame-tracker/shared/db/schema/universe-history';
import { useUniverseHistoryStore } from '../../data/UniverseHistoryDataModule';
import type { GridTableColumn } from '../common/GridTable.vue';

interface AllianceHistoryItem {
    alliance: { name: string; tag: string } | null;
    start: number | null;
    end: number | null;
}

const props = defineProps({
    playerId: { required: true, type: Number },
});

const universeHistoryStore = useUniverseHistoryStore();

const history = ref<OgameTrackerUniverseHistoryPlayerAlliance[]>([]);

const loading = ref(true);

async function onPlayerIdChanged() {
    history.value = await universeHistoryStore.getPlayerAllianceHistory(props.playerId);
    loading.value = false;
}

const allianceHistoryColumns = computed<GridTableColumn<keyof AllianceHistoryItem | '-'>[]>(() => {
    return [
        {
            key: 'alliance',
            label: translations().extension.universeHistory.alliance,
        },
        {
            key: 'start',
            label: translations().extension.universeHistory.from,
        },
        {
            key: '-',
        },
        {
            key: 'end',
            label: translations().extension.universeHistory.until,
        },
    ];
});

const allianceHistoryItems = computed<AllianceHistoryItem[]>(() => {
    return history.value
        .map<AllianceHistoryItem>((item, i, nextHistory) => {
            const start = i == 0 ? null : item.date;
            const end = nextHistory[i + 1]?.date ?? null;

            return {
                alliance: universeHistoryStore.alliances.find(a => a.id == item.allianceId) ?? null,
                start,
                end,
            };
        })
        .reverse();
});

watch(() => props.playerId, onPlayerIdChanged, { immediate: true });
</script>
